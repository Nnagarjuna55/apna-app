const UserModel = require('../models/User');
const TopicModel = require('../models/Topic');


exports.getProgress = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).populate('completedSubtopics');
        const topics = await TopicModel.find().populate('subtopics').lean();


        const totalSub = topics.reduce((acc, t) => acc + (t.subtopics?.length || 0), 0);
        const completed = user.completedSubtopics.length;
        const percent = totalSub === 0 ? 0 : Math.round((completed / totalSub) * 100);


        // topic wise completion
        const topicProgress = topics.map(t => {
            const total = t.subtopics.length;
            const completedCount = t.subtopics.filter(s => user.completedSubtopics.some(cs => String(cs._id) === String(s._id))).length;
            return { topicId: t._id, title: t.title, total, completed: completedCount };
        });


        res.json({ totalSub, completed, percent, topicProgress });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};