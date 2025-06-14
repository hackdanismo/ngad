# NGAD

## Clone the Repo
To clone the monorepo, use `SSL`. Open the terminal:

```shell
$ git clone git@github.com:hackdanismo/ngad.git
```

## Architecture
This is the file structure of the application:

```
ngad/
├── platform/
│   ├── client-api/
│   ├── auth-service/
│   └── frontend/
├── packages/
│   └── shared-utils/
```

+ `client-api` - the API microservice that handles the clients (companies & organisations).

```shell
$ cd platform/client-api
```

## Client API

### Initialization
To initialize the API, we first create a `package.json` file.

```shell
$ cd client-api
$ npm init -y
```

Adding a `.gitignore` file is a good idea at this point as it prevents any packages and libraries contained inside of the `node_modules` directory, when created, to be added to version control system such as `Git`.

`Express` is then installed:

```shell
$ npm install express
```

### Create the Server
Once `Express` has been setup, we can now create a basic server. The server will not handle any requests as yet. This is within a file named `server.js`.

```javascript
// Import the Express library
const express = require('express');
// Create an instance of the Express library
const app = express();
// Define the port number for the server
const PORT = 3001;

// Start the server and listen for incoming HTTP requests on the port number
app.listen(PORT, () => {
    // Log message to confirm the server is running
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

To run the server, open the terminal:

```shell
$ node server.js
```

This will run on the port provided: `http://localhost:3001`

### Adding a Health Check Route
A `health check route` is a simple endpoint that helps to confirm that the API is alive and reachable.

The route/endpoint looks like this:

```javascript
// Health check route/endpoint to check the API is okay
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});
```

This can be tested by running the server and pointing to the endpoint: `http://localhost:3001/health` - the output should be:

```json
{"status":"OK","message":"API is running"}
```

### Adding Company Endpoints
We will now add two routes/endpoints:

+ `GET /companies` - list all companies/organisations
+ `POST /companies` - add a new company/organisation

To perform a `GET` request on the `companies` endpoint, we can use `curl` or `Postman` once the server is running and from a second terminal:

```shell
$ curl http://localhost:3001/companies
```

This will return an empty array at first:

```
[]
```

To add a company/organisation using the `POST` request to the `companies` endpoint, we can use `curl` or `Postman`:

```shell
curl -X POST http://localhost:3001/companies \
     -H "Content-Type: application/json" \
     -d '{"name": "OpenAI", "description": "AI Research Company"}'
```

The response:

```shell
{
  "id": 1720000000000,
  "name": "OpenAI",
  "description": "AI Research Company"
}
```

Another `GET` request can be used to confirm this has been added.

### Delete Endpoint
Once a company/organisation has been added, it can then be deleted using the `DELETE /companies/:id` endpoint.

```shell
$ curl -X DELETE http://localhost:3001/companies/PUT_ID_HERE

# Example:
curl -X DELETE http://localhost:3001/companies/1720001234567
```

The response:

```shell
{
  "message": "Company deleted",
  "company": {
    "id": 1720001234567,
    "name": "TestCo",
    "description": "Temporary company"
  }
}
```

## Database
At the initial stages of development for the application, the temporary array will be replaced with a database. `SQLite` will be used for development before a switch to a production-level database at a later stage.

+ Easy and clean to start with
+ Uses SQL syntax
+ No separate database needed at this stage

We can look to scale to a better database, such as `PostegreSQL` later.

Check that we have `SQLite` installed:

```shell
$ sqlite3 --version
```

Should get response like this:

```shell
3.37.0 2021-12-09 01:34:53 9ff244ce0739f8ee52a3e9671adb4ee54c83c640b02e3f9d185fd2f9a179aapl
```

We will setup `Prisma` as our `ORM` to make it easy to work with our database.

```shell
$ npm install prisma --save-dev
$ npx prisma init
```

This will create a `prisma` folder directory containing a `schema.prisma` file and in our main folder, an `.env` environment file.

+ `schema.primsa` - the database schema is here
+ `.env` - the database connection config

The `.env` file is opened and updated to replace the database URL with the following to tell Prisma to use a local SQLite file called `dev.db`.

```
DATABASE_URL="file:./dev.db"
```

### Define a Schema
In the `Prisma` setup file: `prisma/schema.prisma`, we can define a modal for the Company:

```
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  //provider = "postgresql"
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Company {
  id              Int      @id @default(autoincrement())
  name            String
  description     String
  createdAt       DateTime @default(now())
}
```

Once the schema file has been updated and save, run these commands:

```shell
$ cd platform/client-api

$ npx prisma generate
$ npx prisma migrate dev --name init
```

+ Generates the Prisma client to: `../generated/prisma` folder
+ Apply the model to the SQLite database - `dev.db`
+ Prepare everything for use in the Express application

### Connect Express Server to Prisma and Database
To connect the Express `server.js` code to out SQLite database via the Prisma ORM, we must install the following package:

```shell
$ npm install @prisma/client
```