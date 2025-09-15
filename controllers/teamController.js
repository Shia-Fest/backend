const Team = require('../models/Team');

// @create a new team 
// @route POST /api/teams
// @access Private/Admin

const createTeam = async (req, res) => {
    const { name } = req.body;

    if(!name) {
        return res.status(400).json({ message: 'Team name is required' });
    }
    try {
        const teamExists = await Team.findOne({ name });
        if(teamExists) {
            return res.status(400).json({ message: 'Team already exists' });
        }

        const team = new Team({
            name,
        })
        const createdTeam = await team.save();
        res.status(201).json(createdTeam);
    }
    catch (error) {
        console.error(`Error while creating team: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc Get all teams 
// @route Get /api/teams
// @access Public
const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({});
        res.status(200).json(teams);
    }
    catch (error) {
        console.error(`Error while fetching teams: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc Delete a team by ID
// @route DELETE /api/teams/:id
// @access Private/Admin
const deleteTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if(!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.deleteOne();
        res.status(200).json({ message: 'Team removed successfully' });
    }
    catch (error) {
        console.error(`Error while deleting team: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createTeam,
    getAllTeams,
    deleteTeamById,
}