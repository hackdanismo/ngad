// Import the Express library
const express = require('express');
const { PrismaClient } = require('@prisma/client');

// Create an instance of the Express library
const app = express();
const prisma = new PrismaClient();
// Define the port number for the server 
const PORT = 3001;

// Middleware to parse JSON from request bodies
app.use(express.json());

// Temporary in-memory "database" for initial development/demo purposes - empty array
// let companies = [];

// Endpoint: Health check route/endpoint to check the API is okay
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Endpoint: GET /companies - list all the companies/organisations
app.get('/companies', async (req, res) => {
    const companies = await prisma.company.findMany();
    res.status(200).json(companies);
});

// Endpoint: POST /companies - add a new company/organisation
app.post('/companies', async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required. '});
    }

    const newCompany = await prisma.company.create({
        data: {
            name,
            description
        }
    });

    /*
    const newCompany = {
        id: Date.now(),     // Simple unique ID
        name,
        description
    };
    */

    // Add the new company to the temporary array
    //companies.push(newCompany);
    res.status(201).json(newCompany);
});

// Endpoint: DELETE /companies/:id - remove a company/organisation by its ID
app.delete('/companies', async (req, res) => {
    // Get the ID value from the URL route parameter
    const companyId = parseInt(req.params.id);
    // Use the findIndex function to locate the company/organisation in the temporary database array
    //const index = companies.findIndex(c => c.id === companyId);

    try {
        const deleted = await prisma.company.delete({
            where: {
                id: companyId
            }
        });
        res.status(200).json({ message: 'Company deleted', company: deleted });
    } catch {
        res.status(404).json({ error: 'Company not found' });
    }

    /*
    if (index === -1) {
        return res.status(404).json({ error: 'Company is not found' });
    }
    */

    // Remove the company/organisation using the splice function
    //const deleted = companies.splice(index, 1);
    // Return response if successful
    //res.status(200).json({ message: 'Company deleted', company: deleted[0] });
});

// Start the server and listen for incoming HTTP requests on the port number
app.listen(PORT, () => {
    // Log message to confirm the server is running
    console.log(`Server is running on http://localhost:${PORT}`);
});