import React, { useState } from "react";
import { TextField, Button, Typography, Alert, Box, Card } from "@mui/material";
import { useActionData, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

const Login = ({ setUserGlobal }) => {
	const navigate = useNavigate();
	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});


	const [error, setError] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCredentials({
			...credentials,
			[name]: value,
		});
	};
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	//   setCookie("token", "your_token_value", 7);
	const handleSignIn = () => {
		axios
			.post("http://localhost:4000/api/login", {
				username: credentials.username,
				password: credentials.password,
			})
			.then((res) => {
				localStorage.setItem('token', res.data.token)
				// setCookie("token", res.data.token, "7");
				console.log(res)
				setUserGlobal({ username: res.data.username, role: res.data.role });
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err.response.data);
			});
		setError("");
		setCredentials({
			username: "",
			password: "",
		});
	};

	const handleSignUp = () => {
		navigate("/signup");
		console.log("Sign Up");
	};

	return (
		<Box className="login-container d-flex flex-column align-items-center m-0 p-0">
			<Typography
				variant="h4"
				component="h1"
				className="text-center py-3"
				style={{ fontFamily: "Cursive" }}
			>
				FAU TA Management System
			</Typography>

			<Box
				style={{ backgroundColor: "rgb(255,255,255,0.0)", width: "60%", }}
				className=" py-2 px-5 signInContainer  mt-4 d-flex flex-column justify-content-center align-items-center"
			>
				<Card style={{ width: "60%", padding: "20px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "40px" }}>
					<Typography variant="h4" gutterBottom className="fw-bold" style={{ fontFamily: "Cursive", color: "black", margin: "0px,auto", paddingLeft: "170px" }}>
						Sign In
					</Typography>
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						value={credentials.username}
						onChange={handleChange}
						style={{ marginBottom: "20px" }}
					/>
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						value={credentials.password}
						onChange={handleChange}
						style={{ marginBottom: "20px" }}
					/>
					{error && (
						<Box style={{ marginBottom: "20px" }}>
							<Alert severity="error">{error}</Alert>
						</Box>
					)}
					<Button
						variant="contained"
						color="primary"
						fullWidth
						style={{ marginBottom: "10px" }}
						onClick={handleSignIn}
					>
						Sign In
					</Button>
					<Button
						variant="outlined"
						color="primary"
						fullWidth
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Card>
			</Box>
			{/* <Card>
			<Box
				style={{ backgroundColor: "white", width: "60%" }}
				className="shadow py-2 px-5 signInContainer border mt-4 d-flex flex-column justify-content-center align-items-center"
			>
				<Box className="py-2">
					<Typography
						variant="h4"
						component="h1"
						gutterBottom
						className="fw-bold pl-4"
						style={{ fontFamily: "Cursive" }}
					>
						Sign In
					</Typography>
				</Box>
				<Box className="my-2">
					<TextField
						label="Username"
						variant="outlined"
						fullWidth
						name="username"
						style={{ backgroundColor: "rgb(200,200,200)", width: "150%" }}
						value={credentials.username}
						onChange={handleChange}
					/>
				</Box>
				<Box className="my-2">
					<TextField
						label="Password"
						variant="outlined"
						fullWidth
						type="password"
						name="password"
						style={{ backgroundColor: "rgb(200,200,200)", width: "150%" }}
						value={credentials.password}
						onChange={handleChange}
					/>
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
						onClick={handleSignIn}
					>
						Sign In
					</Button>
				</Box>
				<Box className="my-2">
					<Button
						variant="outlined"
						color="primary"
						fullWidth
						style={{ width: "200%" }}
						onClick={handleSignUp}
					>
						Sign Up
					</Button>
				</Box>
			</Box>
			</Card> */}
		</Box>
	);
};

export default Login;
