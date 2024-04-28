import React, { useEffect } from "react";
import { useState } from "react";
import {
	Button,
	Container,
	Typography,
	Paper,
	Chip,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	Table,
	TableContainer,
	Box,
	Grid,
	CircularProgress,
	Toolbar,
} from "@mui/material";
import axios from "axios";
import { LeftMenu } from "./Utils";
import Download1 from '../../utils/dwnld.png'

const ApplicationsTC = ({ setUser, user }) => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);

	const fillApplications = (apps) => {
		const newApplications = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				// if (app.status[index] === "In Review") {
				newApplications.push({
					...app,
					DSCourses: [course],
					index,
				});
				// }
			});
		});

		setApplications(newApplications);
	};

	const handleApprove = async (id, index, i, statusButton) => {
		try {
			const response = await axios.post("http://localhost:4000/api/updateStatus", {
				applicantId: id,
				index,
				newStatus: statusButton,
			});

			if (response.status === 200) {
				alert("Status updated successfully");
				const newApplications = [...applications];
				newApplications[i].status = statusButton;
				setApplications(newApplications);
			}
		} catch (err) {
			alert("Failed to update status");
			console.error("Error updating status:", err);
		}
	};

	useEffect(() => {
		const fetchApplicants = async () => {
			try {
				const response = await axios.get("http://localhost:4000/api/getApplicants");
				console.log('app', response.data)
				fillApplications(response.data);
				setLoading(false);
			} catch (error) {
				console.error("There was an error fetching the applicants:", error);
			}
		};

		fetchApplicants();
	}, []);

	const downloadFile = async (name, filename) => {
		try {
			filename = filename.substring(8);
			const response = await axios.get(`http://localhost:4000/api/download-resume/${filename}`, {
				responseType: "blob",
			});

			const file = new Blob([response.data], {
				type: "application/octet-stream",
			});

			const downloadUrl = window.URL.createObjectURL(file);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.setAttribute("download", `${name}-resume.pdf`);
			document.body.appendChild(link);
			link.click();

			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<Box>
			<Grid container>
				<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

					<LeftMenu setUser={setUser} />
				</Toolbar>
				<Grid item className="mx-5 pt-5" xs style={{ height: "100vh" }}>
					<Typography
						variant="h4"
						className="fw-bold my-4"
						style={{ display: "flex", justifyContent: "flex-end", fontStyle: "italic" }}
					>
						Welcome {user.username}, <Button variant="contained" style={{ margin: "20px", color: "white", backgroundColor: "#1DA1F2" }} >
							TA Committee Member
						</Button>
					</Typography>
					{loading ? (
						<Container>
							<CircularProgress />
						</Container>
					) : (
						<Box>
							<Typography
								variant="h6"
								className=" fw-bold my-4 ms-3"
								style={{ fontFamily: "cursive" }}
							>

								{
									// applications.filter((application) =>
									// 	application.status.includes("In Review")
									// ).length
									applications.length
								}{" "}
								Applications
							</Typography>
							<Box
								className="px-2"
								style={{ height: "75vh", overflow: "auto" }}
							>
								<TableContainer component={Paper} className="shadow">
									<Table aria-label="simple table">
										<TableHead>
											<TableRow>
												<TableCell>
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Znumber
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Name
													</Typography>
												</TableCell>
												<TableCell align="right">
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Email
													</Typography>
												</TableCell>
												<TableCell align="right">
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Selected Courses
													</Typography>
												</TableCell>
												<TableCell align="left">
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Previous Courses
													</Typography>
												</TableCell>
												<TableCell align="left">
													<Typography
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Resume
													</Typography>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{console.log(applications)}
											{applications
												// .filter((application) =>
												// 	application.status.includes("In Review")
												// )
												.map((application, index) => (
													<TableRow key={index}>
														<TableCell component="th" scope="row">
															{application?.znumber}
														</TableCell>
														<TableCell component="th" scope="row">
															{application.name}
														</TableCell>
														<TableCell align="right">
															{application.email}
														</TableCell>
														<TableCell align="right">
															{application.DSCourses.map((course, index) => {
																return (
																	<Chip
																		label={course}
																		className="m-1"
																		key={index}
																	/>
																);
															})}
														</TableCell>
														<TableCell align="left">
															{application.previousTACourses.map(
																(course, index) => {
																	return (
																		<Chip
																			label={course}
																			className="m-1"
																			key={index}
																		/>
																	);
																}
															)}
														</TableCell>
														<TableCell align="left">
															<Button
																// variant="outlined"
																// color="primary"
																onClick={() =>
																	downloadFile(
																		application.name,
																		application.resume
																	)
																}
															>
																<img src={Download1} alt="Status Icon" style={{ marginRight: '5px', width: '40px', height: '40px' }} />
															</Button>
														</TableCell>
														{
															application.status.includes("In Review") && <>
																<TableCell>
																	<Button
																		variant="contained"
																		color="success"
																		style={{ marginRight: "20px" }}
																		onClick={() =>
																			handleApprove(
																				application._id,
																				application.index,
																				index,
																				"Approved"

																			)
																		}
																	>
																		Approve
																	</Button>
																	<Button
																		variant="contained"
																		style={{ color: "white", backgroundColor: "red" }}

																		onClick={() =>
																			handleApprove(
																				application._id,
																				application.index,
																				index,
																				"Rejected"
																			)
																		}
																	>
																		Reject
																	</Button>
																</TableCell>
															</>
														}
														{
															application.status.includes("Rejected") && <>
																<TableCell>

																	<Button
																		variant="contained"
																		style={{ color: "white", backgroundColor: "red" }}

																	>
																		Rejected
																	</Button>
																</TableCell>
															</>
														}
														{
															application.status.includes("Approved") && <>
																<TableCell>

																	<Button
																		variant="contained"
																		style={{ color: "white", backgroundColor: "green" }}

																	>
																		Approved
																	</Button>
																</TableCell>
															</>
														}


													</TableRow>
												))}
										</TableBody>
									</Table>
								</TableContainer>
							</Box>
						</Box>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationsTC;
