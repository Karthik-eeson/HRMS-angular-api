using System.Text.Json;
using demoApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;

if (args.Length < 1 || args.Length > 2)
    throw new ArgumentException("Pass the API appsettings.json path.");
using var settings = JsonDocument.Parse(File.ReadAllText(args[0]));
var connectionString = settings.RootElement.GetProperty("ConnectionStrings")
    .GetProperty("DefaultConnection").GetString()
    ?? throw new InvalidOperationException("DefaultConnection is missing.");
var connection = new SqlConnectionStringBuilder(connectionString);
if (connection.InitialCatalog != "afablez-demo-db" || connection.DataSource != @"(localdb)\MSSQLLocalDB")
    throw new InvalidOperationException("Setup only supports afablez-demo-db.");
var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlServer(connection.ConnectionString).Options;
await using var context = new AppDbContext(options);
var created = await context.Database.EnsureCreatedAsync();
Console.WriteLine(created ? "Database and tables created." : "Database already exists; no schema changes made.");
Console.WriteLine($"Users: {await context.Users.CountAsync()}; Employees: {await context.Employees.CountAsync()}");
if (args.Length == 2 && args[1] == "--create-user")
    await CreateUser.Run(context);
else if (args.Length == 2 && args[1] == "--test-api")
    await ApiCheck.Run(context);
else if (args.Length == 2)
    throw new ArgumentException("Use --create-user or --test-api.");
