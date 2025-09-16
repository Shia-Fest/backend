const express = require('express')
const router = express.Router({ mergeParams: true});
const { addProgrammeResults } = require('../controllers/resultController');

router.route('/')
    .post(addProgrammeResults)

module.exports = router;