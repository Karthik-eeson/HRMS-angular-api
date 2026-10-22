using System.ComponentModel.DataAnnotations;
using demoApi.Data;
using demoApi.Model;
using Microsoft.EntityFrameworkCore;

public static class CreateUser
{
    public static async Task Run(AppDbContext db)
    {
        Console.Write("Login email: ");
        var email = Console.ReadLine()?.Trim() ?? "";
        if (!new EmailAddressAttribute().IsValid(email))
            throw new ArgumentException("Enter a valid email.");
        if (await db.Users.AnyAsync(x => x.Email == email))
            throw new InvalidOperationException("This email already exists. No changes made.");
        Console.Write("Password (minimum 8 characters, hidden): ");
        var password = ReadPassword();
        if (password.Length < 8 || System.Text.Encoding.UTF8.GetByteCount(password) > 72)
            throw new ArgumentException("Use at least 8 characters and at most 72 UTF-8 bytes.");
        Console.Write("Confirm password: ");
        if (password != ReadPassword()) throw new ArgumentException("Passwords do not match.");
        // Store only a password hash, never the plain password.
        db.Users.Add(new User { Email = email, PasswordHash = BCrypt.Net.BCrypt.HashPassword(password) });
        await db.SaveChangesAsync();
        Console.WriteLine("Login user saved in SQL Server.");
    }

    private static string ReadPassword()
    {
        var result = new System.Text.StringBuilder();
        while (true)
        {
            var key = Console.ReadKey(intercept: true);
            if (key.Key == ConsoleKey.Enter) break;
            if (key.Key == ConsoleKey.Backspace && result.Length > 0) result.Length--;
            else if (!char.IsControl(key.KeyChar)) result.Append(key.KeyChar);
        }
        Console.WriteLine();
        return result.ToString();
    }
}
