using System.ComponentModel.DataAnnotations;

namespace demoApi.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required]
        public string Name { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public decimal Salary { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}