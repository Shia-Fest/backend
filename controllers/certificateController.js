const PDFDocument = require('pdfkit');
const Result = require('../models/Result');

// @desc Generate a certificate for a specific result
// @route Get /api/results/:id/certificate
// @access Public 
const generateCertificate = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('candidate', 'name')
            .populate('programme', 'name date')
        
        if (!result) {
            return res.status(404).json({ message: 'Result not found'})
        }

        const { candidate, programme, rank, grade } = result;
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
        })
        // Set response headers to trigger a download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="certificate_${candidate.name}_${programme.name}.pdf"`);

        // Pipe the PDF content directly to the response 
        doc.pipe(res);

        // start drawing the certificate 

        // Add a placeholder for a border (can be replaced with an image)
        doc.rect(20,20, doc.page.width - 40, doc.page.height - 40).stroke();

        // Title
        doc.fontSize(40).font('Helvetica-Bold').text('Certificate of Achievement', { align: 'center'}); 
        doc.moveDown(1.5);

        doc.fontSize(20).font('Helvetica').text('Proudly presented to ', {align: 'center'});
        doc.moveDown(1);

        doc.fontSize(36).font('Helvetica-Bold').text(candidate.name, { align: 'center'});
        doc.moveDown(1.5);

        let achievementText = `for their outstanding performance in the programme`;
        doc.fontSize(18).font('Helvetica').text(achievementText, { align: 'center'});
        doc.moveDown(0.5);

        doc.fontSize(24).font('Helvetica-Bold').text(programme.name, { align: 'center'});
        doc.moveDown(1)

        // Rank and grade 
        let rankAndGrade = '';
        if (rank) rankAndGrade += `Achieving rank: ${rank}`;
        if (rank &&  grade) rankAndGrade += `with`;
        if (grade) rankAndGrade += `Grade: ${grade}`;

        if (rankAndGrade) {
            doc.fontSize(18).font('Helvetica').text(rankAndGrade, { align: 'center'});
        }

        const eventDate = new Date(programme.date).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
        })
        doc.fontSize(16).text(`Event held on: ${eventDate}`, 200, doc.y + 50, {align: 'left'})
        doc.end();
    }
    catch (error) {
        console.error(`Error while generating certificate ${error.message}`);
        res.status(500).json({ message: 'Server Error'})
    }
}

module.exports = {
    generateCertificate,
}