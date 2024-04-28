const express = require('express')
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = express.Router()
const applicationController = require('../controllers/application')

const uploadsDir = "./uploads";
fs.existsSync(uploadsDir) || fs.mkdirSync(uploadsDir, { recursive: true });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
})
const upload = multer({ storage: storage });

router.post('/submitApplication', upload.single("resume"), applicationController.submitApplication);
router.get('/getApplicants', applicationController.getApplicants);
router.put('/updateApplicant/:id', applicationController.updateApplicant)
router.post('/updateStatus', applicationController.updateStatus)
router.get('/getAcceptedApplications', applicationController.getAcceptedApplications)
router.post('/add-course', applicationController.addCourse)
router.get('/get-all-courses', applicationController.getAllCourses)
router.post('/createFeedback', applicationController.createFeedback)
router.get('/getAllFeedbacks', applicationController.getAllFeedbacks)
router.get('/getFeedbacks/:username', applicationController.getFeedbackUserName)
router.post('/notifications', applicationController.Notifications)
router.get('/notifications/:username', applicationController.notificationUserName)
router.get('/notifications/:role', applicationController.notificationRole)
router.delete('/notifications/:id', applicationController.deleteNotification)

module.exports = router