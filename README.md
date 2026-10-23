# Afablez local development

See [LEARNING-GUIDE.md](LEARNING-GUIDE.md) for simple explanations, account creation, SQL queries and API test commands.

Start the API in one terminal:

```powershell
cd G:\afablez-demo\afablex-demo-api
dotnet run --launch-profile http
```

Start Angular in another terminal:

```powershell
cd G:\afablez-demo\frontend
npm start -- --open
```

Open http://localhost:4200. Angular proxies `/api` to http://localhost:5207.
Swagger is available at http://localhost:5207/swagger.
The local HTTP profile avoids requiring a development TLS certificate.
Production still requires HTTPS and a same-origin reverse proxy for `/api`.

The API uses SQL Server LocalDB `(localdb)\MSSQLLocalDB`, database `afablez-demo-db`, with Windows authentication.
Login requires an existing Users record with a BCrypt password hash in that database.
No users or passwords are seeded automatically. Sessions use an HttpOnly, SameSite=Strict cookie;
employee APIs require authentication. All authenticated users currently have employee CRUD access;
role-specific authorization is not implemented.
