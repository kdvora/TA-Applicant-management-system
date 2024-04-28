import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	ApplicationsDS,
	ApplicationsTC,
	Login,
	Signup,
	ApplicationForm,
	InputCourse,
	ApplicationList,
	Feedback,
	FeedbackList,
	FeedbackListDS,
	FeedbackListTC,
	FeedbackListStudent,
} from "./components";
import axios from "axios";
import "./styles/App.css";
import { Box, CircularProgress } from "@mui/material";

const App = () => {
	const [user, setUser] = useState(null);
	const handleSetUser = (user) => {
		setUser(user);
	};
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log("----getUser----frontend112234")
		axios
			.get("http://localhost:4000/api/getUser", { headers: { "Authorization": localStorage.getItem('token') } })
			.then((res) => {
				console.log(res.data);
				setUser(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<Box className="d-flex justify-content-center align-items-center h-100 mt-5">
				<CircularProgress className="mt-5" />
			</Box>
		);
	}

	return (
		<Router>
			<Routes>
				{user && user.role === "Department Staff" && (
					<>
						<Route
							path="/new-course"
							element={<InputCourse setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="/feedbacks"
							element={<FeedbackListDS setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="*"
							element={<ApplicationsDS setUser={handleSetUser} user={user} />}
						/>
					</>
				)}
				{user && user.role === "TA Committee Member" && (
					<>
						<Route
							path="/feedbacks"
							element={<FeedbackListTC setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="*"
							element={<ApplicationsTC setUser={handleSetUser} user={user} />}
						/>
					</>
				)}
				{user && user.role === "Student" && (
					<>
						<Route
							path="/apply"
							element={<ApplicationForm setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="/feedbacks"
							element={<FeedbackListStudent setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="*"
							element={<ApplicationList setUser={handleSetUser} user={user} />}
						/>
					</>
				)}
				{user && user.role === "Instructor" && (
					<>
						<Route
							path="/feedback"
							element={<Feedback setUser={handleSetUser} user={user} />}
						/>
						<Route
							path="*"
							element={<FeedbackList setUser={handleSetUser} user={user} />}
						/>
					</>
				)}
				{!user && (
					<>
						<Route
							path="/signup"
							element={<Signup setUserGlobal={handleSetUser} user={user} />}
						/>
						<Route
							path="*"
							element={<Login setUserGlobal={handleSetUser} user={user} />}
						/>
					</>
				)}
			</Routes>
		</Router>
	);
};

export default App;
