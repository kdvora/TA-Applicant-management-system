import { Article, Logout, Person } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";


const LeftMenu = ({ setUser }) => {
	const navigate = useNavigate();


	const handleLogout = async () => {
		try {
			console.log("Logging out");
			await axios.post("http://localhost:4000/api/logout", { token: localStorage.getItem('token') });
			console.log("Logged out");
			setUser(null);
			localStorage.removeItem('token')
			navigate("/");
		} catch (error) {
			console.error("There was a problem logging out:", error);
		}
	};

	return (
		<>
			<Box className="d-flex justify-content-center p-3">

				<Avatar sx={{ width: 50, height: 50, bgcolor: "#00bcd4" }} >
					<Person />	</Avatar>
			</Box>


			<Box sx={{ display: "flex", justifyContent: "center", gap: "20px", padding: "0px 450px" }}>
				{/* First NavLink */}
				<Box className="d-flex justify-content-start align-items-center w-100 ">
					<NavLink
						to="/"
						className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
					>
						{/* <Article className="fs-3 me-2" style={{ color: "#3357FF" }} /> */}
						<Typography
							// variant="overline"
							className="fw-bold fs-6"
							// color={"white"}
							style={{ color: "white", fontSize: "32px", fontStyle: "italic" }}
						>
							Applications
						</Typography>
					</NavLink>
				</Box>
				{/* Second NavLink */}

				<Box className="d-flex justify-content-start align-items-center w-100">
					<NavLink
						to="/new-course"
						className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
					>
						{/* <Article className="fs-3 me-2" style={{ color: "#3357FF" }} /> */}
						<Typography
							// variant="overline"
							className="fw-bold fs-6"
							// color={"white"}
							style={{ color: "white", fontStyle: "italic" }}
						>
							Input&nbsp;Course
						</Typography>
					</NavLink>
				</Box>

				{/* Third NavLink */}
				<Box className="d-flex justify-content-start align-items-center w-100">
					<NavLink
						to="/feedbacks"
						className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
					>
						{/* <Article className="fs-3 me-2" style={{ color: "#3357FF" }} /> */}
						<Typography
							// variant="overline"
							className="fw-bold fs-6"
							// color={"white"}
							style={{ color: "white", fontStyle: "italic", fontSize: "200px" }}
						>
							Feedback
						</Typography>
					</NavLink>
				</Box>
			</Box >
			<Box className="d-flex justify-content-start align-items-center w-100 ms-3">
				{/* <Logout className="fs-3 me-2" style={{ color: "red" }} /> */}
				<Button variant="text" color="inherit" onClick={handleLogout}>
					<Typography
						// variant="overline"
						className="fw-bold fs-6"
						color={"white"}
						style={{ fontSize: "70px", fontStyle: "italic" }}
					>
						Log&nbsp;Out
					</Typography>
				</Button>
			</Box>
		</>

	);
};

export { LeftMenu };

