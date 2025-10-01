const express = require('express');
const router = express.Router();

// Import all necessary controller functions
const {
  createProgramme,
  getAllProgrammes,
  getProgrammeById,
  updateProgramme,
  deleteProgramme,
} = require('../controllers/programmeController.js');
const { approvePendingResults } = require('../controllers/resultController.js');

// Import the security middleware
const { protect } = require('../middlewares/authMiddleware.js');

// Import the router for the nested 'results' resource
const resultRouter = require('./resultRoutes.js');


// --- Main Programme Routes ---
// Handle GET for all programmes and POST to create a new one
router.route('/')
  .get(getAllProgrammes)
  .post(protect, createProgramme);

// --- THE FIX: Define the specific nested routes BEFORE the general ones ---

// This creates the specific endpoint: POST /api/programmes/:id/approve
router.route('/:id/approve')
  .post(protect, approvePendingResults);

// This correctly delegates any requests starting with /:id/results to the resultRouter
// It will match: GET, POST, DELETE /api/programmes/:id/results
router.use('/:id/results', resultRouter);


// --- Specific Programme Routes (by ID) ---
// These handle GET, PUT, and DELETE for a single programme.
// This route now comes LAST, so it only catches requests for /api/programmes/:id itself.
router.route('/:id')
  .get(getProgrammeById)
  .put(protect, updateProgramme)
  .delete(protect, deleteProgramme);

module.exports = router;

