const Result = require('../models/Result');
const Programme = require('../models/Programme');
const Candidate = require('../models/Candidate');
const Team = require('../models/Team');
const Settings = require('../models/Settings');

const rankPointsMap = {
    'Stage': { 1: 5, 2: 3, 3: 1},
    'Non-Stage': {1: 5, 2: 3, 3:1},
    'Starred': {1: 7, 2: 5, 3: 3},
    'Group': {1: 7, 2: 5, 3: 3},
    'General': {1: 10, 2: 7, 3: 5},
    'Special': {1: 15, 2:10, 3: 7},
}

// @desc Add result for specific programmes
// @routes POST /api/programmes/:id/results
// @access Private/Admin
const addProgrammeResults = async (req, res) => {
    const { results } = req.body;
    const { id: programmeId } =req.params;

    if (!results || !Array.isArray(results) || results.length === 0) {
        return res.status(400).json({ message: 'Results array is required'});
    }
    try {
        const programme = await Programme.findById(programmeId);
        if (!programme) return res.status(404).json({ message: 'Programme not found' });

        let settings = await Settings.findOne();
        if (!settings) settings = await new Settings().save();
        const gradePointsMap = settings.gradePoints;

        for (const resultData of results) {
            const { candidateId, rank, grade } = resultData;
            
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) continue;

            const existingResult = await Result.findOne({ programme: programmeId, candidate: candidateId });
            const oldPoints = existingResult ? existingResult.totalPoints : 0;
            
            const pointsFromRank = rank ? (rankPointsMap[programme.type]?.[rank] || 0) : 0;
            const pointsFromGrade = grade ? (gradePointsMap.get(grade) || 0) : 0;
            const newPoints = pointsFromRank + pointsFromGrade;

            // This is the critical fix: calculate the difference in points
            const pointDifference = newPoints - oldPoints;

            // Update the result document
            await Result.findOneAndUpdate(
                { programme: programmeId, candidate: candidateId },
                { rank: rank || null, grade: grade || null, pointsFromRank, pointsFromGrade, totalPoints: newPoints },
                { upsert: true, new: true }
            );

            // Apply the point difference to the candidate and team
            if (pointDifference !== 0) {
                candidate.totalPoints += pointDifference;
                await candidate.save();
                
                await Team.updateOne({ _id: candidate.team }, { $inc: { totalPoints: pointDifference } });
            }
        }
        
        programme.isResultPublished = true;
        await programme.save();
        res.status(201).json({ message: 'Results saved successfully' });
    }
    catch (error) {
        console.error(`Error while adding results ${error.message}`);
        res.status(500).json({ message: 'Server Error'});
    }
}

// @desc Get all results for a specific programmes 
// @route Get /api/programmes/:id/results
// @access Private/Admin
const getProgrammeResults = async (req, res) => {
    try {
        const results = await Result.find({ programme: req.params.id });
        res.status(200).json(results);
    }
    catch (error) {
        console.error('Error while get Programme results');
        res.status(500).json({message: 'Server Error'});
    }
}

module.exports = {
    addProgrammeResults,
    getProgrammeResults,
}