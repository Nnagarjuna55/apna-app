const { Schema, model } = require('mongoose');


const topicSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    subtopics: [{ type: Schema.Types.ObjectId, ref: 'Subtopic' }],
}, { timestamps: true });


module.exports = model('Topic', topicSchema);