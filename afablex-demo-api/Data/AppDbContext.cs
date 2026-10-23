using demoApi.Model;
using demoApi.Models; 
using Microsoft.EntityFrameworkCore;

namespace demoApi.Data   
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Employees Table
        public DbSet<Employee> Employees { get; set; }

        // Users Table (Login)
        public DbSet<User> Users { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>().Property(employee => employee.Salary).HasPrecision(18, 2);
        }
    }
}
