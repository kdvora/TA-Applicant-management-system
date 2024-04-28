const express = require("express");
const multer = require("multer");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const applicationRoutes = require('./routes/application')
const User = require('./models/user');
const Application = require('./models/application');
const Notification = require('./models/notification');
const Course = require('./models/course');
const Feedback = require('./models/feedback');
require("dotenv").config();

const app = express();
app.use(express.json());
// app.use(cors());
app.use(
	cors({ credentials: true, origin: true, exposedHeaders: ["set-cookie"] })
);
app.use(bodyParser.json());
app.use(cookieParser());

const port = process.env.PORT || 4000;

///routes
app.use('/api', userRoutes)
app.use('/api', applicationRoutes)
app.get('/api/download-resume/:filename', (req, res) => {
	console.log(req.params, "hii")
	const filename = req.params.filename;
	const fileDirectory = path.join(__dirname, "uploads");
	const filePath = path.join(fileDirectory, filename);
	console.log(filePath)

	if (fs.existsSync(filePath)) {
		console.log("helloooooo")
		res.setHeader("Content-Disposition", "attachment; filename=" + filename);

		const readStream = fs.createReadStream(filePath);
		readStream.pipe(res);
	} else {
		res.status(404).send("File not found");
	}
})




mongoose.connect('mongodb+srv://sshanmukhispriya:z8q5yAdr7KuSpQwV@cluster0.vlwlrso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => {
		console.log("suucessfully work mongo db")
		app.listen(4000)
	}).catch(err => {
		console.log(err)
	})


