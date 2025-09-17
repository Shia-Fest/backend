const Team = require('../models/Team');
const Candidate = require('../models/Candidate');

// @desc Get all leaderboards (team and top students by category)
// @route GET /api/leaderboards
// @access Public
const getLeaderboards = async (req, res) => {
    try {
        // Get team leaderboard
        // Simple find and sort since we are already tracking totalPoints
        const teamLeaderboard = await Team.find({}).sort({ totalPoints: -1 })

        // Get Top student leaderboard using Aggregation 
        const topStudents = await Candidate.aggregate([
            // Stage 1: Filter out candidates with 0 or less points
            {
                $match: {totalPoints: { $gt: 0 }}
            },
            // Stage 2: Sort candidates by total points in descending order
            {
                $sort: {totalPoints: -1}
            },
            // Stage 3: Group candidates by their category
            {
                $group: {
                    _id: "$category", // Group by the 'category' field
                    candidates: {
                        $push: { // Push the top candidates into an array
                            _id:"$_id",
                            name: "$name",
                            totalPoints: "$totalPoints",
                            team: "$team",
                            image: "$image"
                        }
                    }
                }
            },
            {
                $project: {
                    category: "$_id",
                    candidates: { $slice: ["$candidates", 5]},
                    _id: 0
                }
            },
        ]);
        // Get overall Top Students 
        const overallTopStudents = await Candidate.find({})
            .sort({ totalPoints: -1})
            .limit(10)
            .populate('team', 'name')

        res.status(200).json({
            teamLeaderboard,
            categoryTopStudents: topStudents,
            overallTopStudents,
        })
    }
    catch (error) {
        console.error(`Error while fetching leaderboards ${error.message}`);
        res.status(500).json({message: 'Server Error'})
    }
}

module.exports = getLeaderboards;