using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using demoApi.Models;
using demoApi.Data;

namespace demoApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmployeesController(AppDbContext context) => _context = context;

        [HttpGet]
        public IActionResult GetEmployees()
        {
            return Ok(_context.Employees.OrderBy(x => x.EmployeeId).ToList());
        }

        [HttpGet("summary")]
        public IActionResult Summary()
        {
            return Ok(new {
                employeeCount = _context.Employees.Count(),
                totalSalary = _context.Employees.Sum(x => (decimal?)x.Salary) ?? 0
            });
        }

        [HttpGet("{id:int}")]
        public IActionResult GetEmployee(int id)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        [HttpPost]
        public IActionResult AddEmployee(EmployeeInput input)
        {
            // SQL Server generates EmployeeId. The API sets the creation date.
            var employee = new Employee {
                Name = input.Name.Trim(),
                Email = input.Email.Trim(),
                Salary = input.Salary,
                CreatedAt = DateTime.UtcNow
            };
            _context.Employees.Add(employee);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        [HttpPut("{id:int}")]
        public IActionResult UpdateEmployee(int id, EmployeeInput input)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return NotFound();
            employee.Name = input.Name.Trim();
            employee.Email = input.Email.Trim();
            employee.Salary = input.Salary;
            _context.SaveChanges();
            return Ok(employee);
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteEmployee(int id)
        {
            var employee = _context.Employees.Find(id);
            if (employee == null) return NotFound();
            _context.Employees.Remove(employee);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
