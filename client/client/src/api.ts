import axios from 'axios';

// Create an instance
const api = axios.create({
    // This is the only place you change the URL when you deploy!
    // Local: http://localhost:3000
    // Live: https://your-backend.onrender.com
    baseURL: 'http://localhost:3000', 
});

export default api;

