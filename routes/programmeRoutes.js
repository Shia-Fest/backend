const express = require('express');
const router = express.Router();
const {
    createProgramme,
    getAllProgrammes,
    getProgrammeById,
    updateProgramme,
    deleteProgramme
}  = require('../controllers/programmeController');
const resultRouter = require('./resultRoutes')

router.use('/:id/results', resultRouter);

router.route('/')
    .get(getAllProgrammes)
    .post(createProgramme);

router.route('/:id')
    .get(getProgrammeById)
    .put(updateProgramme)
    .delete(deleteProgramme);

module.exports = router;