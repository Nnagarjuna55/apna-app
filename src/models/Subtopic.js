const { Schema, model: m } = require('mongoose');


const subtopicSchema = new Schema({
    title: { type: String, required: true },
    leetlink: { type: String },
    ytlink: { type: String },
    article: { type: String },
    level: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'EASY' },
    // order or index inside parent topic
    order: { type: Number, default: 0 },
}, { timestamps: true });


module.exports = m('Subtopic', subtopicSchema);