import React, { useEffect, useState } from "react";
import {
	Typography,
	TextField,
	Button,
	Container,
	Grid,
	Box,
	Toolbar,
	Card,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Table,
	TableContainer,
} from "@mui/material";
import { LeftMenu } from "./Utils";
import axios from "axios";

const InputCourse = ({ setUser }) => {
	const [courseName, setCourseName] = useState("");
	const [availableCourses, setAvailableCourses] = useState([]);

	useEffect(() => {
		const fetchCourseNames = async () => {
			try {
				const response = await axios.get("http://localhost:4000/api/get-all-courses");

				if (response.status === 200) {
					setAvailableCourses(response.data.courseNames);
				}
			} catch (err) {
				console.error("Error fetching courses:", err);
			}
		};

		// Call the function to fetch course names when the component mounts
		fetchCourseNames();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post("http://localhost:4000/api/add-course", {
				courseName,
			});

			if (response.status === 201) {
				alert("Course added successfully");
				const newAvailableCourses = [...availableCourses, courseName];
				setAvailableCourses(newAvailableCourses);
				setCourseName("");
			}
		} catch (err) {
			alert("Failed to add the course");
			console.error("Error adding course:", err);
		}
		console.log(`Submitted course name: ${courseName}`);
	};

	return (
		<Box className="">
			<Grid container>
				<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

					<LeftMenu setUser={setUser} />
				</Toolbar>


				<Grid item xs className="mx-5 pt-5">
					<Card style={{
						backgroundColor: "rgb(255,255,255,0.1)", width: "60%", margin: '0px auto', borderRadius: "35px"
					}}>
						<Box
							// style={{ backgroundColor: "rgba(236,100,255,0.4)" }}
							className=" px-3 py-3"
						>
							<Typography
								variant="h5"
								gutterBottom
								style={{ fontFamily: "cursive" }}
								className="fw-bold"
							>
								Course Requirements
							</Typography>
							<form onSubmit={handleSubmit}>
								<Container className="mb-3">
									<TextField
										label="Course Name"
										variant="outlined"
										fullWidth
										value={courseName}
										onChange={(e) => setCourseName(e.target.value)}
									/>
								</Container>
								<Box className="d-flex justify-content-center">
									<Button variant="contained" color="primary" type="submit">
										Submit
									</Button>
								</Box>
							</form>
						</Box>
						{availableCourses.length !== 0 && (
							<Box
								className="shadow container mt-4 py-3 px-4"
							// style={{ backgroundColor: "rgba(255,255,0,0.7)" }}
							>
								<Typography
									variant="h5"
									gutterBottom
									style={{ fontFamily: "cursive" }}
									className="fw-bold"
								>
									Course Names
								</Typography>
								{/* <Grid container>
									{availableCourses?.map((courseName, index) => (
										<Grid item xs={5}>
											<Typography>{courseName}</Typography>
										</Grid>
									))}
								</Grid> */}
								<TableContainer className="shadow">
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														S.No
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Course
													</Typography>
												</TableCell>


											</TableRow>
										</TableHead>
										<TableBody>

											{availableCourses
												// .filter((application) =>
												// 	application.status.includes("In Review")
												// )
												.map((courseName, index) => (
													<TableRow key={index}>
														<TableCell component="th" scope="row">
															{index + 1}
														</TableCell>
														<TableCell component="th" scope="row">
															{courseName}
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						)}
					</Card>
				</Grid>
			</Grid>
		</Box >
	);
};

export default InputCourse;
