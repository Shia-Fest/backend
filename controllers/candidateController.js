const Candidate = require('../models/Candidate');
const Team = require('../models/Team');
const cloudinary = require('cloudinary').v2;

// @desc Create a new candidate
// @route POST /api/candidates
// @access Public/Admin
const createCandidate = async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is missing' });
    }
    const { admissionNo, name, team, category } = req.body;

    try {
        const candidateExists = await Candidate.findOne({ admissionNo });
        if (candidateExists) {
            return res.status(400).json({message: 'Candidate with this admission number already exists'});
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload candidate image'});
        }

        const newCandidate = new Candidate({
            admissionNo,
            name,
            team, 
            category, 
            image: {
                url: req.file.path,
                public_id: req.file.filename,
            }
        });

        const savedCandidate = await newCandidate.save();
        res.status(201).json(savedCandidate);
    }
    catch (error) {
        console.error('Error creating candidate:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc Get all candidates
// @route GET /api/candidates
// @access Public
const getAllCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find({}).populate('team', 'name');
        res.status(200).json(candidates);
    }
    catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error'});
    }
}

// @desc    Get a single candidate by ID
// @route   GET /api/candidates/:id
// @access  Public (for now)
const getCandidateById = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id).populate('team', 'name');
        if(candidate) {
            res.status(200).json(candidate);
        }  else {
            res.status(404).json({ message: 'Candidate not found'});
        }
    }
    catch (error) {
        console.error('Error fetching candidate by Id:', error);
        res.status(500).json({ message: 'Server error'});
    }
}

// @desc Update a candidate 
//  @route PUT /api/candidate/:id
// @access Private/Admin
const updateCandidate = async (req, res) => {
    const { admissionNo, name, team, category, isResultPublished} = req.body;
    try {
        const candidate = await Candidate.findById(req.params.id);
        if(!candidate) {
            return res.status(404).json({ message: 'Candidate not found'})
        }

        if(req.file) {
            await cloudinary.uploader.destroy(candidate.image.public_id);
            candidate.image.url =  req.file.path
            candidate.image.public_id = req.file.filename;
        }

        candidate.admissionNo = admissionNo || candidate.admissionNo;
        candidate.name = name || candidate.name;
        candidate.team = team || candidate.team;
        candidate.category = category || candidate.category;

        const updateCandidate = await candidate.save();
        res.status(200).json(updateCandidate);
    }
    catch (error) {
        console.error('Error updating candidate:', error);
        res.status(500).json({ message: 'Server error'});
    }
}

// @desc Delete a candidate
// @route DELETE /api/candidates/:id
// @access Private/Admin

const deleteCandidate = async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if(!candidate) {
            return res.status(404).json({ message: 'Candidate not found'});
        }

        await cloudinary.uploader.destroy(candidate.image.public_id);
        await candidate.deleteOne();

        res.status(200).json({ message: 'Candidate deleted successfully'});

    }
    catch(error) {
        console.error('Error deleting candidate: ', error);
        res.status(500).json({ message: 'Server error'});
    }
}

module.exports = {
    createCandidate, 
    getAllCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
}