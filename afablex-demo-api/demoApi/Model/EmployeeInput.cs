using System.ComponentModel.DataAnnotations;

namespace demoApi.Models
{
    // The browser sends only these editable fields.
    public class EmployeeInput
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Range(typeof(decimal), "0", "9999999999999999.99")]
        public decimal Salary { get; set; }
    }
}
