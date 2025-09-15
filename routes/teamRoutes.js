const express = require('express');
const router = express.Router();
const {
    createTeam,
    getAllTeams,
    deleteTeamById
} = require('../controllers/teamController');

router.route('/')
    .get(getAllTeams)
    .post(createTeam);

router.route('/:id')
    .delete(deleteTeamById);
module.exports = router;