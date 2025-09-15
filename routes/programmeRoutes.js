const express = require('express');
const router = express.Router();
const {
    createProgramme,
    getAllProgrammes,
    getProgrammeById,
    updateProgramme,
    deleteProgramme
}  = require('../controllers/programmeController');

router.route('/')
    .get(getAllProgrammes)
    .post(createProgramme);

router.route('/:id')
    .get(getProgrammeById)
    .put(updateProgramme)
    .delete(deleteProgramme);

module.exports = router;