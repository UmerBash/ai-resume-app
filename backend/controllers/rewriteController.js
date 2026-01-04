const { rewriteContent } = require('../services/aiService');

const rewriteText = async (req, res) => {
    try {
        const { currentText, jobDescription } = req.body;

        if (!currentText || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: 'Current text and Job Description are required'
            });
        }

        const result = await rewriteContent(currentText, jobDescription);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Rewrite Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to rewrite text',
            error: error.message
        });
    }
};

module.exports = { rewriteText };
