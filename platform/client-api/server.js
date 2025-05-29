// Import the Express library
const express = require('express');
// Create an instance of the Express library
const app = express();
// Define the port number for the server 
const PORT = 3001;

// Middleware to parse JSON from request bodies
app.use(express.json());

// Temporary in-memory "database" for initial development/demo purposes - empty array
let companies = [];

// Endpoint: Health check route/endpoint to check the API is okay
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Endpoint: GET /companies - list all the companies/organisations
app.get('/companies', (req, res) => {
    res.status(200).json(companies);
});

// Endpoint: POST /companies - add a new company/organisation
app.post('/companies', (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required. '});
    }

    const newCompany = {
        id: Date.now(),     // Simple unique ID
        name,
        description
    };

    // Add the new company to the temporary array
    companies.push(newCompany);
    res.status(201).json(newCompany);
});

// Start the server and listen for incoming HTTP requests on the port number
app.listen(PORT, () => {
    // Log message to confirm the server is running
    console.log(`Server is running on http://localhost:${PORT}`);
});