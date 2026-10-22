using System.ComponentModel.DataAnnotations;

namespace demoApi.Model
{
    public class User
    {
        [Key] // Primary Key
        public int UserId { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
    }
}
