# How data moves in this project

Angular screen -> Angular service -> .NET controller -> SQL Server table

- Login email/password are checked against Users. Only a BCrypt hash is saved.
- The header loads the logged-in user's email using GET /api/Auth/me.
- Employee forms send name, email, salary to the API.
- The API saves these fields in Employees using SaveChanges().
- SQL Server generates EmployeeId. The API sets CreatedAt.
- Employee list and salary list read Employees.
- Dashboard count and total salary are calculated from Employees.

Form fields and loading messages temporarily live in Angular memory. Saved business data lives in SQL Server.

## 1. Create your login account

Open a terminal:

~~~powershell
cd G:\afablez-demo
dotnet run --project tools/database-setup/DatabaseSetup.csproj -- afablex-demo-api/demoApi/appsettings.json --create-user
~~~

Enter your email, password, and password confirmation when prompted.
Password characters are hidden. The tool saves a password hash in Users.
It refuses an existing email instead of replacing the account.
This is a local development tool; it is not a public registration API.

## 2. Start the backend (terminal 1)

~~~powershell
cd G:\afablez-demo\afablex-demo-api\demoApi
dotnet run --launch-profile http
~~~

Expected: Now listening on http://localhost:5207
Swagger: http://localhost:5207/swagger
Keep this terminal running. Ctrl+C stops the API.

## 3. Start the frontend (terminal 2)

~~~powershell
cd G:\afablez-demo\frontend
npm start -- --open
~~~

Open http://localhost:4200 and log in with the account you created.
Employee Profile -> Add Employee -> enter name/email/salary -> Save.
The saved record appears in Employee List. Edit and Delete update SQL Server.
The salary tab reads the same employee salary field; it is not a payroll calculation module.
Dashboard totals update when you navigate back to the dashboard.

If a server is already running, use it rather than starting another on the same port.

## 4. Verify in SQL Server Management Studio

Connect to (localdb)\MSSQLLocalDB with Windows authentication.
Open New Query and execute:

~~~sql
USE [afablez-demo-db];

SELECT UserId, Email FROM dbo.Users;
SELECT EmployeeId, Name, Email, Salary, CreatedAt FROM dbo.Employees;
SELECT COUNT(*) AS EmployeeCount, COALESCE(SUM(Salary), 0) AS TotalSalary
FROM dbo.Employees;
~~~

## 5. API endpoints

| Action | Method and endpoint |
| --- | --- |
| Login | POST /api/Auth/login |
| Current user | GET /api/Auth/me |
| Logout | POST /api/Auth/logout |
| Employee list | GET /api/Employees |
| Dashboard totals | GET /api/Employees/summary |
| One employee | GET /api/Employees/ID |
| Add | POST /api/Employees |
| Edit | PUT /api/Employees/ID |
| Delete | DELETE /api/Employees/ID |

Employee add/edit JSON example (illustration only; not seeded):

~~~json
{ "name": "Your employee name", "email": "employee@example.com", "salary": 25000 }
~~~

Controllers use EmployeeInput so the browser cannot assign IDs or creation dates.
401 means you need to log in; 400 means invalid input; 404 means the employee was not found.
All logged-in users currently have employee CRUD access. Admin roles are not implemented.

## 6. Run checks

Backend must be running before the API test:

~~~powershell
cd G:\afablez-demo
dotnet run --project tools/database-setup/DatabaseSetup.csproj -- afablex-demo-api/demoApi/appsettings.json --test-api
~~~

This creates temporary test records, checks login and employee CRUD, and removes those records.
It prints PASS for each successful check.

Frontend production build:

~~~powershell
cd G:\afablez-demo\frontend
npm run build
~~~

Temp Users, Reports, Payslips, password recovery and other placeholder modules are not implemented.
No dummy records are used for those screens.
