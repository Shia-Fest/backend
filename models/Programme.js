const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Stage', 'Non-Stage', 'Starred', 'Group', 'General', 'Special'],
     },
    date: { 
        type: Date,
         required: true,
    },
    description: { 
        type: String,
    },
    isResultPublished: { 
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

const Programme = mongoose.model('Programme', programmeSchema);
module.exports = Programme;