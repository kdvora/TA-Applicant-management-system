const Application = require('../models/application');
const Notification = require('../models/notification');
const Course = require('../models/course');
const Feedback = require('../models/feedback');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

exports.submitApplication = async (req, res) => {
    try {
        console.log(req.body)
        const {
            username,
            znumber,
            name,
            email,
            phoneNumber,
            joiningDate,
            previousCourses,
            eligibleCourses,
        } = req.body;
        const resume = req.file ? req.file.path : null;

        const previousCoursesArray = JSON.parse(previousCourses);
        const eligibleCoursesArray = JSON.parse(eligibleCourses);

        const pendingArray = Array(eligibleCoursesArray.length).fill("Pending");

        // Create a new application document
        const application = new Application({
            username,
            znumber,
            name,
            email,
            phoneNumber,
            joiningDate,
            previousTACourses: previousCoursesArray,
            eligibleCourses: eligibleCoursesArray,
            DSCourses: [],
            resume,
            status: pendingArray,
        });
        console.log('app', application)
        // Save the application to the database
        await application.save();

        res.status(200).send({
            message: "Application submitted successfully",
            docId: application._id, // Use the _id property of the saved document
        });
    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).send({ error: "Internal server error" });
    }
}
exports.getApplicants = async (req, res) => {
    try {
        console.log('getapplicants', req.body, req.query)
        const { user } = req.query;
        let applicants;

        if (user) {
            applicants = await Application.find({ username: user });
        } else {
            applicants = await Application.find();
        }
        console.log('sdfhjcdbn', applicants)

        res.status(200).json(applicants);
    } catch (error) {
        console.error("Error fetching applicants:", error);
        res.status(500).send("Error fetching applicants");
    }
}
exports.updateApplicant = async (req, res) => {
    const { id } = req.params;
    console.log("update applicant", req.body)
    const updatedData = req.body;

    try {
        // Find the application by ID and update it
        await Application.findByIdAndUpdate(id, updatedData);

        res.status(200).send({ message: "Application updated successfully" });
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).send({ message: "Failed to update application", error });
    }
}
exports.updateStatus = async (req, res) => {
    try {

        const { applicantId, index, newStatus, review } = req.body;

        // Find the application by ID
        const application = await Application.findById(applicantId);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Update the status at the specified index
        application.status[index] = newStatus;

        // Save the updated application
        await application.save();

        // Create a new notification
        const newNotification = new Notification({
            username: null,
            role: "Instructor",
            message: `${application.name} has been accepted for TAship for ${application.eligibleCourses[index]}.`,
        });

        // Save the notification to the database
        await newNotification.save();

        res.status(200).json({ message: "Status updated successfully" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ error: "Failed to update status" });
    }
}
exports.getAcceptedApplications = async (req, res) => {
    try {
        // Find applications where the status array contains "Accepted"
        const acceptedApplications = await Application.find({ status: "Accepted" });

        res.status(200).json(acceptedApplications);
    } catch (error) {
        console.error("Error fetching accepted applications:", error);
        res.status(500).json({ error: "Error fetching accepted applications" });
    }
}
exports.addCourse = async (req, res) => {
    try {
        const { courseName } = req.body;

        // Create a new course document using the Course model
        const newCourse = new Course({ courseName });

        // Save the new course to the database
        await newCourse.save();

        res.status(201).json({ message: "Course added successfully", id: newCourse._id });
    } catch (error) {
        console.error("Error adding course:", error);
        res.status(500).json({ error: "Failed to add the course" });
    }
}
exports.getAllCourses = async (req, res) => {
    try {
        // Find all courses
        const courses = await Course.find({}, 'courseName'); // Project only the courseName field

        // Extract course names from the documents
        const courseNames = courses.map(course => course.courseName);

        res.status(200).json({ courseNames });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
}
exports.createFeedback = async (req, res) => {
    try {
        const { username, name, email, course, feedback, rating } = req.body;

        // Create a new feedback document using the Feedback model
        const newFeedback = new Feedback({
            username,
            name,
            email,
            course,
            feedback,
            rating,
        });

        // Save the new feedback to the database
        await newFeedback.save();

        const newNotification = {
            username,
            role: "Student",
            message: `You have received feedback for ${course}`,
        };


        res.status(201).json({ message: "Feedback created successfully", id: newFeedback._id });
    } catch (error) {
        console.error("Error creating feedback:", error);
        res.status(500).json({ error: "Failed to create feedback" });
    }
}
exports.getAllFeedbacks = async (req, res) => {
    try {
        // Find all feedbacks using the Feedback model
        console.log('----------------get allfeedback---------------------------')
        const feedbacks = await Feedback.find();
        console.log("feedbacks", feedbacks)

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
}
exports.getFeedbackUserName = async (req, res) => {
    try {
        const { username } = req.params;

        // Find all feedbacks for the given username using the Feedback model
        const feedbacks = await Feedback.find({ username });

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
}
exports.Notifications = async (req, res) => {
    try {
        const newNotification = req.body;

        // Create a new notification document using the Notification model
        const addedNotification = await Notification.create(newNotification);

        res.status(201).json({ id: addedNotification._id, ...newNotification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.notificationUserName = async (req, res) => {
    try {
        console.log(req.params, "notificationusername")
        const username = req.params.username;

        // Find all notifications for the given username using the Notification model
        const notifications = await Notification.find({ username });
        console.log('noo', notifications)

        if (notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this user." });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.notificationRole = async (req, res) => {
    try {
        const role = req.params.role;

        // Find all notifications for the given role using the Notification model
        const notifications = await Notification.find({ role });

        if (notifications.length === 0) {
            return res.status(404).json({ message: "No notifications found for this role." });
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
exports.deleteNotification = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the notification by ID and delete it using the Notification model
        await Notification.findByIdAndDelete(id);

        res.status(200).json({ message: "Notification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
