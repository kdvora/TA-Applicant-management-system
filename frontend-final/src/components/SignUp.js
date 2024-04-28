import React, { useState } from "react";
import {
	TextField,
	Button,
	Typography,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	Card
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const Signup = ({ setUserGlobal }) => {
	const navigate = useNavigate();

	const [user, setUser] = useState({
		username: "",
		password: "",
		confirmPassword: "",
		role: "",
	});
	const [error, setError] = useState("");
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({
			...user,
			[name]: value,
		});
	};

	const handleSignUp = () => {
		if (user.password !== user.confirmPassword) {
			setError("Passwords don't match.");
			return;
		}

		axios
			.post("http://localhost:4000/api/signup", {
				username: user.username,
				password: user.password,
				role: user.role,
			})
			.then((res) => {
				// setCookie("token", res.data.token, "7");
				localStorage.setItem('token', res.data.token)
				console.log(res);
				setUserGlobal({ username: res.data.username, role: res.data.role });
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data);
			});

		console.log("Sign Up", user);
		setUser({
			username: "",
			password: "",
			confirmPassword: "",
			role: "",
		});
		setError("");
	};

	return (
		<Box className="signup-container d-flex flex-column align-items-center m-0 p-0">
			<Typography
				variant="h4"
				component="h1"
				className="text-center py-3"
				style={{ fontFamily: "Cursive" }}
			>
				FAU TA Management System
			</Typography>


			<Box
				style={{ backgroundColor: "rgb(255,255,255,0.0)", width: "40%" }}
				className=" py-2 px-5 signInContainer mt-4 d-flex flex-column justify-content-center align-items-center"
			>
				{/* <Card style={{ width: "100%" }}>
					<Box className="py-4">
						<Typography
							variant="h4"
							component="h1"
							gutterBottom
							className="fw-bold"
							style={{ fontFamily: "Cursive", color: "green" }}
						>
							Sign Up
						</Typography>
					</Box>
					<Box className="my-2">
						<TextField
							label="Username"
							style={{ backgroundColor: "rgb(200,200,200)", width: "120%" }}
							variant="outlined"
							fullWidth
							name="username"
							value={user.username}
							onChange={handleChange}
						/>
					</Box>
					<Box className="my-2">
						<TextField
							label="Password"
							variant="outlined"
							fullWidth
							style={{ backgroundColor: "rgb(200,200,200)", width: "120%" }}
							type="password"
							name="password"
							value={user.password}
							onChange={handleChange}
						/>
					</Box>
					<Box className="my-2">
						<TextField
							label="Confirm Password"
							variant="outlined"
							fullWidth
							style={{ backgroundColor: "rgb(200,200,200)", width: "120%" }}
							type="password"
							name="confirmPassword"
							value={user.confirmPassword}
							onChange={handleChange}
						/>
					</Box>
					<Box className="my-2">
						<FormControl variant="outlined" fullWidth style={{ width: "280px" }}>
							<InputLabel id="role-label">Role</InputLabel>
							<Select
								labelId="role-label"
								label="Role"
								name="role"
								style={{ backgroundColor: "rgb(200,200,200)", width: "150%" }}
								value={user.role}
								onChange={handleChange}
							>
								<MenuItem value="Student">Student</MenuItem>
								<MenuItem value="TA Committee Member">
									TA Committee Member
								</MenuItem>
								<MenuItem value="Department Staff">Department Staff</MenuItem>
								<MenuItem value="Instructor">Instructor</MenuItem>
							</Select>
						</FormControl>
					</Box>

					{error && (
						<Box className="my-2">
							<Alert severity="error">{error}</Alert>
						</Box>
					)}
					<Box className="my-2">
						<Button
							variant="contained"
							color="primary"
							fullWidth
							style={{ width: "200%" }}
							onClick={handleSignUp}
						>
							Sign Up
						</Button>
					</Box>
				</Card> */}
				<Card style={{ width: "100%", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "40px" }}>


					<Typography variant="h4" gutterBottom className="fw-bold" style={{ fontFamily: "Cursive", color: "black", margin: "0px,auto", paddingLeft: "170px" }}>
						Sign Up
					</Typography>


					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={user.username}
						onChange={handleChange}
						// style={{ marginBottom: "20px" }}
						style={{ marginBottom: "20px", borderRadius: "10px" }}
					/>

					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						value={user.password}
						onChange={handleChange}
						style={{ marginBottom: "20px" }}
					/>
					<TextField
						label="Confirm Password"
						variant="outlined"
						fullWidth
						type="password"
						name="confirmPassword"
						value={user.confirmPassword}
						onChange={handleChange}
						style={{ marginBottom: "20px" }}
					/>
					<FormControl variant="outlined" fullWidth style={{ marginBottom: "20px" }}>
						<InputLabel id="role-label">Role</InputLabel>
						<Select
							labelId="role-label"
							label="Role"
							name="role"
							value={user.role}
							onChange={handleChange}
						>
							<MenuItem value="Student">Student</MenuItem>
							<MenuItem value="TA Committee Member">TA Committee Member</MenuItem>
							<MenuItem value="Department Staff">Department Staff</MenuItem>
							<MenuItem value="Instructor">Instructor</MenuItem>
						</Select>
					</FormControl>

					{error && (
						<Box style={{ marginBottom: "20px" }}>
							<Alert severity="error">{error}</Alert>
						</Box>
					)}

					<Button
						variant="contained"
						color="primary"
						fullWidth
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Card>
			</Box>
		</Box >
	);
};

export default Signup;
