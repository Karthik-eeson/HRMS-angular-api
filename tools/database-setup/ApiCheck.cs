using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using demoApi.Data;
using demoApi.Model;
using Microsoft.EntityFrameworkCore;

public static class ApiCheck
{
    public static async Task Run(AppDbContext db)
    {
        var email = "test-" + Guid.NewGuid().ToString("N") + "@example.invalid";
        var password = Guid.NewGuid().ToString("N");
        var user = new User { Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(password) };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        using var handler = new HttpClientHandler { CookieContainer = new CookieContainer() };
        using var client = new HttpClient(handler) { BaseAddress = new Uri("http://localhost:5207") };
        try
        {
            Check((await client.GetAsync("/api/Employees")).StatusCode == HttpStatusCode.Unauthorized, "Anonymous access blocked");
            Check((await client.PostAsJsonAsync("/api/Auth/login", new { email, password = "wrong-password" })).StatusCode == HttpStatusCode.Unauthorized, "Wrong password rejected");
            (await client.PostAsJsonAsync("/api/Auth/login", new { email, password })).EnsureSuccessStatusCode();
            Check((await client.GetFromJsonAsync<JsonElement>("/api/Auth/me")).GetProperty("email").GetString() == email, "Login session reads DB user");
            var invalid = await client.PostAsJsonAsync("/api/Employees", new { name = "", email = "bad", salary = -1 });
            Check(invalid.StatusCode == HttpStatusCode.BadRequest, "Invalid employee rejected");
            var added = await client.PostAsJsonAsync("/api/Employees", new { name = "API test", email, salary = 123.45m });
            Check(added.StatusCode == HttpStatusCode.Created, "Employee created");
            var id = (await added.Content.ReadFromJsonAsync<JsonElement>()).GetProperty("employeeId").GetInt32();
            Check(await db.Employees.AnyAsync(x => x.EmployeeId == id && x.Salary == 123.45m), "Employee persisted in SQL Server");
            var list = await client.GetFromJsonAsync<JsonElement>("/api/Employees");
            Check(list.EnumerateArray().Any(x => x.GetProperty("employeeId").GetInt32() == id), "List reads saved employee");
            (await client.PutAsJsonAsync("/api/Employees/" + id, new { name = "Updated test", email, salary = 456.78m })).EnsureSuccessStatusCode();
            Check(await db.Employees.AnyAsync(x => x.EmployeeId == id && x.Salary == 456.78m), "Update persisted");
            var summary = await client.GetFromJsonAsync<JsonElement>("/api/Employees/summary");
            Check(summary.GetProperty("employeeCount").GetInt32() == await db.Employees.CountAsync(), "Dashboard count matches DB");
            Check(summary.GetProperty("totalSalary").GetDecimal() == (await db.Employees.SumAsync(x => (decimal?)x.Salary) ?? 0), "Dashboard salary matches DB");
            (await client.DeleteAsync("/api/Employees/" + id)).EnsureSuccessStatusCode();
            Check(!await db.Employees.AnyAsync(x => x.EmployeeId == id), "Delete persisted");
            Check((await client.GetAsync("/api/Employees/" + id)).StatusCode == HttpStatusCode.NotFound, "Deleted employee returns 404");
            (await client.PostAsync("/api/Auth/logout", null)).EnsureSuccessStatusCode();
            Check((await client.GetAsync("/api/Employees")).StatusCode == HttpStatusCode.Unauthorized, "Logout clears session");
        }
        finally
        {
            await db.Employees.Where(x => x.Email == email).ExecuteDeleteAsync();
            await db.Users.Where(x => x.UserId == user.UserId).ExecuteDeleteAsync();
            Console.WriteLine("Temporary test records removed.");
        }
    }

    private static void Check(bool passed, string message)
    {
        if (!passed) throw new Exception("FAIL: " + message);
        Console.WriteLine("PASS: " + message);
    }
}
