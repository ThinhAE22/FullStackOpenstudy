const { test } = require('node:test');
const supertest = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js

test('Test auth', async () => {
    try {
        // Sending login request to get the token
        const loginResponse = await supertest(app)
            .post('/api/login')
            .send({ username: 'T500', password: '1' });

        // Assert that the status code is 200 (or whatever is expected for a successful login)
        if (loginResponse.status !== 200) {
            console.error('Login failed with status:', loginResponse.status);
            return;
        }

        // Log the response body to verify the token
        console.log('Login Response:', loginResponse.body);

        // Check if the token is present in the response body
        const token = loginResponse.body.token;
        if (!token) {
            console.error('No token found in the response.');
            return;
        }

        // Log the token
        console.log('Returned Token:', token);

        // You can further add an assertion here to check if the token exists:
        // e.g., expect(token).toBeTruthy(); (if using Jest)
    } catch (err) {
        console.error('Error during login request:', err);
    }
});
