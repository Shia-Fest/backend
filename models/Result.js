const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    programme: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Programme',
        required: true,
    },
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    rank: {
        type: Number,
        enum: [1,2,3,null],
        default: null,
    },
    grade: {
        type: String, 
        enum: ['A', 'B', null],
        default: null,
    },
    pointsFromRank: { 
         type: Number,
         default: 0 
    },
    pointsFromGrade: { 
        type: Number, 
        default: 0,
    },
    totalPoints: { 
        type: Number, 
        default: 0,
    },
    
    status: {
            type: String,
            enum: ['pending', 'approved'],
            default: 'pending',
    },
    
}, {
    timestamps: true,
    unique: ['programme', 'candidate']
})

const Result = mongoose.model('Result', resultSchema);
module.exports = Result;