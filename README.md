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