const { processChat } = require('../services/aiService');

const handleChat = async (req, res) => {
    try {
        const { message, history, context } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required'
            });
        }

        const reply = await processChat(message, history, context);

        res.status(200).json({
            success: true,
            data: { reply }
        });
    } catch (error) {
        console.error('Chat Controller Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process chat',
            error: error.message
        });
    }
};

module.exports = { handleChat };
