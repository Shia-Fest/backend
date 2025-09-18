const express = require('express')
const router = express.Router({ mergeParams: true});
const { addProgrammeResults } = require('../controllers/resultController');

const certificateRouter = require('./certificateRoutes');
router.use('/:id/certificate', certificateRouter)

router.route('/')
    .post(addProgrammeResults)

module.exports = router;