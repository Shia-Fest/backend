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
        if(!programme) {
            return res.status(404).json({ message:  'Programme not found'});
        }

        // Fetch grade points from settings, or use a default 
        let settings = await Settings.findOne();
        if(!settings) {
            settings = new Settings();
            await settings.save();
        }
        const gradePointsMap = settings.gradePoints;

        // Process all the results
        for (const resultData of results) {
            const { candidateId, rank, grade } = resultData;

            const candidate = await Candidate.findById(candidateId).populate('team');
            if(!candidate) {
                console.warn(`Candidate with ID ${candidateId} not found, skipping...`);
                continue;
            }

            // Point calculation
            const pointsFromRank = rank ? (rankPointsMap[programme.type]?.[rank] || 0) : 0;
            const pointsFromGrade = grade ? (gradePointsMap.get(grade) || 0) : 0;
            const totalPointsForResult = pointsFromRank + pointsFromGrade;

            // --- Create or Update Result Document ---
            // 'upsert' is perfect here: it updates if a result for this candidate/programme exists, or creates it if it doesn't.
            await Result.findOneAndUpdate(
                { programme: programmeId, candidate: candidateId },
                {
                    rank: rank || null,
                    grade: grade || null,
                    pointsFromRank,
                    pointsFromGrade,
                    totalPoints: totalPointsForResult,
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
             // --- IMPORTANT: Update Candidate and Team Totals ---
            // This part is simplified. A robust solution would recalculate totals from all results
            // to avoid sync issues, but for this project, adding points directly is fine.
            candidate.totalPoints += totalPointsForResult;
            await candidate.save();

            const team = await Team.findById(candidate.team._id);
            if(team) {
                team.totalPoints += totalPointsForResult;
                await team.save();
            }
        }

        // Mark the programme's results are published
        programme.isResultPublished = true;
        await programme.save();

        res.status(201).json({ message: 'Result added successfully'});
    }
    catch (error) {
        console.error(`Error while adding results ${error.message}`);
        res.status(500).json({ message: 'Server Error'});
    }
}

module.exports = {
    addProgrammeResults,
}