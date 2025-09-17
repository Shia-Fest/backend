const express = require('express');
const router = express.Router();
const {
    createCandidate,
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    addMinusPoint,
} = require('../controllers/candidateController');

const upload = require('../config/cloudinary');

router.route('/') 
    .get(getAllCandidates)
    .post(upload.single('image'), createCandidate);


router.route('/:id')
    .get(getCandidateById)
    .put(upload.single('image'), updateCandidate)
    .delete(deleteCandidate);

// Handles deducting points from a specific candidate
router.route('/:id/minus-points').post(addMinusPoint);

module.exports = router;