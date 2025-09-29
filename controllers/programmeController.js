const Programme = require('../models/Programme');

// @desc Create a new programme
// @route POST /api/programmes
// @access Private/Admin
const createProgramme = async (req, res) => {
    const { name, type, date, category } = req.body;
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Request body is missing' });
    }
    if( !name || !type || !date || !category) {
        return res.status(400).json({ message: 'Please provide name, type and date for the programme' });
    }
    try {
        const newProgramme = new Programme({
            name,
            type,
            date,
            category,
        })

        const savedProgramme = await newProgramme.save();
        res.status(201).json(savedProgramme);
    }
    catch (error) {
        console.error(`Error while creating programme: ${error.message}`);
        res.status(500).json({ message: 'Server Error'})
    }
}

// @desc Get all programmes
// @route GET /api/programmes
// @access Public
const getAllProgrammes = async (req, res) => {
    try {
        const programmes = await Programme.find({});
        res.status(200).json(programmes)
    }
    catch (error) {
        console.error(`Error while fetching programmes: ${error.message}`);
        res.status(500).json({ message: 'Server Error'});
    }
}

// @desc Get programme by ID 
// @route GET /api/programmes
// @access Public 
const getProgrammeById = async (req, res) => {
    try {
        const programme = await Programme.findById(req.params.id);
        if(programme) {
            res.status(200).json(programme);
        } else {
            res.status(404).json({ message: 'Programme not found'});
        }
    }
    catch (error) {
        console.error(`Error while fetching programme by ID: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc Update a programme
// @route PUT /api/programmes/:id
// @access Private/Admin
const updateProgramme = async (req,res) => {
    const { name, type, date, description, isResultPublished } = req.body;
    try {
        const programme = await Programme.findById(req.params.id);
        if(!programme) {
            return res.status(404).json({ message: 'Programme not found'});
        }

        programme.name = name || programme.name;
        programme.type = type || programme.type;
        programme.date = date || programme.date;
        programme.description = description || programme.description;
        programme.isResultPublished = isResultPublished !== undefined ? isResultPublished : programme.isResultPublished;

        const updatedProgramme = await programme.save();
        res.status(200).json(updatedProgramme);

    }
    catch (error) {
        console.error(`Error while updating programme: ${error.message}`);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc Delete a programme 
// @route DELETE /api/programmes/:id
// @access Private/Admin
const deleteProgramme = async (req, res) => {
    try {
        const programme = await Programme.findById(req.params.id);
        if(!programme) {
            return res.status(404).json({ message: 'Programme not found'});
        }

        await programme.deleteOne();
        res.status(200).json({ message: 'Programme removed successfully'});
    }
    catch (error) {
        console.error(`Error while deleting programme: ${error.message}`);
        res.status(500).json({ message: 'Server Error'});
    }
}

module.exports = {
    createProgramme,
    getAllProgrammes,
    getProgrammeById,
    updateProgramme,
    deleteProgramme,
}