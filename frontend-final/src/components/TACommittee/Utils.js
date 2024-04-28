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
		// <Grid item className="bg-success dashColumn ps-3 pe-3 text-center">
		// 	<Box className="d-flex justify-content-center p-3">
		// 		<Avatar sx={{ width: 100, height: 100 }} />
		// 	</Box>
		// 	<Box className="d-flex align-items-center w-100">
		// 		<NavLink to="/">
		// 			<Article className="fs-3 me-2" style={{ color: "white" }} />
		// 			<Typography
		// 				variant="overline"
		// 				className="fw-bold fs-6"
		// 				color={"white"}
		// 			>
		// 				Applications
		// 			</Typography>
		// 		</NavLink>
		// 	</Box>
		// 	<Box className="d-flex align-items-center w-100">
		// 		<NavLink to="/feedbacks">
		// 			<Article className="fs-3 me-2" style={{ color: "white" }} />
		// 			<Typography
		// 				variant="overline"
		// 				className="fw-bold fs-6"
		// 				color={"white"}
		// 			>
		// 				Feedbacks
		// 			</Typography>
		// 		</NavLink>
		// 	</Box>
		// 	<Box className="d-flex justify-content-start align-items-center w-100 ms-3">
		// 		<Logout className="fs-3 me-2" style={{ color: "white" }} />
		// 		<Button variant="text" color="inherit" onClick={handleLogout}>
		// 			<Typography
		// 				variant="overline"
		// 				className="fw-bold fs-6"
		// 				color={"white"}
		// 			>
		// 				Log Out
		// 			</Typography>
		// 		</Button>
		// 	</Box>
		// </Grid>
		<>
			<Box className="d-flex justify-content-center p-3">
				<Avatar sx={{ width: 50, height: 50, bgcolor: "#00bcd4" }} >

					<Person />


				</Avatar>

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
							style={{ color: "white", fontSize: "200pt", fontStyle: "italic" }}
						>
							Applications
						</Typography>
					</NavLink>
				</Box>

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
							style={{ color: "white", fontStyle: "italic" }}
						>
							Feedback
						</Typography>
					</NavLink>
				</Box>
			</Box>
			<Box className="d-flex justify-content-start align-items-center w-100 ms-3">
				{/* <Logout className="fs-3 me-2" style={{ color: "red" }} /> */}
				<Button variant="text" color="inherit" onClick={handleLogout}>
					<Typography
						// variant="overline"
						className="fw-bold fs-6"
						color={"white"}
						style={{ fontSize: "70px", fontStyle: "italic" }}
					>
						Log Out
					</Typography>
				</Button>
			</Box>
		</>
	);
};

export { LeftMenu };
