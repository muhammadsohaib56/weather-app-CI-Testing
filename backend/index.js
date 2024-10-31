const express = require('express'); // Web server framework
const axios = require('axios'); // HTTP client for API requests
const dotenv = require('dotenv'); // Environment variable loader

// Load environment variables
dotenv.config();

// Create an Express application
const app = express();
const PORT = 5000; // Port number

// Define a route to fetch weather data
app.get('/weather', async (req, res) => {
    const city = req.query.city; // Get city from query parameters
    try {
        // Make a request to the OpenWeatherMap API
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`);
        // Send back the temperature data as JSON
        res.json({ temp: response.data.main.temp });
    } catch (error) {
        res.status(500).send('Error retrieving weather data'); // Handle errors
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
