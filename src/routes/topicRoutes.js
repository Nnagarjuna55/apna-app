const express = require('express');
const router = express.Router();
const { getTopics, toggleSubtopic, createTopic } = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');


router.get('/', protect, getTopics); // authenticated endpoint (but you can make public if you prefer)
router.post('/', protect, createTopic); // admin seeding (use additional middleware in prod)
router.patch('/toggle/:subtopicId', protect, toggleSubtopic);


module.exports = router;