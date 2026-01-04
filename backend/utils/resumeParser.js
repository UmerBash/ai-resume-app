const pdf = require('pdf-parse-fork');
const mammoth = require('mammoth');

const parseResume = async (buffer, mimetype) => {
    try {
        if (mimetype === 'application/pdf') {
            const data = await pdf(buffer);
            return data.text;
        } else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: buffer });
            return result.value;
        } else {
            throw new Error('Unsupported file type');
        }
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw new Error('Failed to parse resume content');
    }
};

module.exports = { parseResume };
