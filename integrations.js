const express = require('express');
const auth = require('../middleware/auth');
const axios = require('axios');
const router = express.Router();

router.get('/github', auth, async (req, res) => {
    try {
        const token = req.header('x-auth-token'); // Securely retrieve the token from headers
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `token ${token}`
            }
        });
        
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching GitHub repositories: ' + err.message });
    }
});

// LinkedIn Integration
router.get('/linkedin', auth, async (req, res) => {
    try {
        // Placeholder for LinkedIn API integration
        res.json({ message: 'LinkedIn data would be fetched here' });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching LinkedIn data: ' + err.message });
    }
});

// LeetCode Integration
router.get('/leetcode', auth, async (req, res) => {
    try {
        // Placeholder for LeetCode API integration
        res.json({ message: 'LeetCode data would be fetched here' });
    } catch (err) {
        res.status(500).json({ error: 'Error fetching LeetCode data: ' + err.message });
    }
});


// LinkedIn Integration
router.get('/linkedin', auth, async (req, res) => {
    try {
        // LinkedIn API integration would go here
        res.json({ message: 'LinkedIn data would be fetched here' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// LeetCode Integration
router.get('/leetcode', auth, async (req, res) => {
    try {
        // LeetCode API integration would go here
        res.json({ message: 'LeetCode data would be fetched here' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
