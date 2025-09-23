const express = require('express')
const router = express.Router({ mergeParams: true});
const { 
    addProgrammeResults,
    getProgrammeResults,
 } = require('../controllers/resultController');

const certificateRouter = require('./certificateRoutes');
router.use('/:id/certificate', certificateRouter)

router.route('/')
    .get(getProgrammeResults)
    .post(addProgrammeResults)

module.exports = router;