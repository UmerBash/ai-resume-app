const express = require('express');
const router = express.Router();
const { uploadResume, matchJob, getResumes } = require('../controllers/resumeController');
const { rewriteText } = require('../controllers/rewriteController');
const { handleChat } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/fileUpload');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/list', protect, getResumes);
router.post('/match', protect, matchJob);
router.post('/rewrite', protect, rewriteText);
router.post('/chat', protect, handleChat);

module.exports = router;
