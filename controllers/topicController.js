const Topic = require('../models/Topic');
const Subtopic = require('../models/Subtopic');
const User = require('../models/User');


// Get all topics with populated subtopics
exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find().populate('subtopics').lean();
        // If user is present (authenticated), mark status per subtopic
        const userCompleted = req.user ? new Set(req.user.completedSubtopics.map(String)) : new Set();
        const topicsWithStatus = topics.map(t => ({
            ...t,
            subtopics: t.subtopics.map(s => ({
                ...s,
                status: userCompleted.has(String(s._id)) ? 'Done' : 'Pending'
            }))
        }));
        res.json(topicsWithStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Toggle a subtopic for the logged-in user (mark Done or remove)
exports.toggleSubtopic = async (req, res) => {
    try {
        const userId = req.user._id;
        const { subtopicId } = req.params;
        const user = await User.findById(userId);
        const idx = user.completedSubtopics.findIndex(id => String(id) === String(subtopicId));
        let action;
        if (idx === -1) {
            user.completedSubtopics.push(subtopicId);
            action = 'added';
        } else {
            user.completedSubtopics.splice(idx, 1);
            action = 'removed';
        }
        await user.save();


        // Determine if parent topic is fully completed
        const topics = await Topic.find({ subtopics: subtopicId });
        let topicCompleted = false;
        if (topics.length) {
            const topic = topics[0];
            const total = topic.subtopics.length;
            const completedCount = user.completedSubtopics.filter(sid => topic.subtopics.map(String).includes(String(sid))).length;
            topicCompleted = completedCount === total;
        }


        res.json({ message: `Subtopic ${action}`, topicCompleted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


// Admin utility: create topic with subtopics (optional seed)
exports.createTopic = async (req, res) => {
    try {
        const { title, description, subtopics } = req.body; // subtopics: [{title, leetlink, ytlink, article, level}]
        const createdSubtopics = await Subtopic.insertMany(subtopics || []);
        const topic = await Topic.create({ title, description, subtopics: createdSubtopics.map(s => s._id) });
        res.status(201).json(await topic.populate('subtopics'));
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};