import React, { useEffect, useState } from "react";
import axios from "axios";
import {
	Alert,
	Badge,
	Box,
	Button,
	Chip,
	CircularProgress,
	Container,
	Grid,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Toolbar,
} from "@mui/material";
import { LeftMenu } from "./Utils";
import { Notifications } from "@mui/icons-material";
import "../../styles/ApplicationList.css";
import Rejected from '../../utils/rej.png';
import Approved from '../../utils/appro.png';
import Pending from '../../utils/pen.jpg'
// import Accepted from '../../utils/acc.png'
import InReview from '../../utils/revi.png'
import Accepted from '../../utils/acceptt.png'
import Allow from '../../utils/acc1.png'
import Reject from '../../utils/rej1.png'

const ApplicationList = ({ setUser, user }) => {
	const [applications, setApplications] = useState([]);
	const [notifOpen, setNotifOpen] = useState(false);
	const [notifs, setNotifs] = useState([]);
	const [loading, setLoading] = useState(true);

	const fillApplications = (apps) => {
		console.log("apps", apps)
		const newApps = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				newApps.push({
					course,
					status: app.status[index],
					index,
					id: app._id,
				});
			});
		});

		setApplications(newApps);
	};

	useEffect(() => {
		const fetchApplications = async () => {
			try {
				console.log("--user name-----------------", user)
				const response = await axios.get(
					`http://localhost:4000/api/getApplicants?user=${user.username}`
				);
				if (response.status === 200) {
					console.log(response, "fjfjfj")
					fillApplications(response.data);
					setLoading(false);
				}
				const response2 = await axios.get(
					`http://localhost:4000/api/notifications/${user.username}`
				);
				if (response2.status === 200) {
					setNotifs(response2.data);
				}
			} catch (error) {
				console.error("Error fetching applications:", error);
			}
		};

		fetchApplications();
	}, [user.username]);

	const getStatusBGColor = (status) => {
		switch (status) {
			case "Pending":
				return "warning";
			case "In Review":
				return "info";
			case "Accepted":
				return "success";
			case "Approved":
				return "secondary";
			case "Rejected":
				return "error";
			default:
				return "secondary";
		}
	};

	const handleAccept = async (id, index, i, statusButton) => {
		try {
			console.log("-----id------", id)
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

	const handleNotifClose = async (id) => {
		const resp = await axios.delete(`http://localhost:4000/api/notifications/${id}`);
		if (resp.status === 200) {
			const newNotifs = notifs.filter((notif) => notif._id !== id);
			setNotifs(newNotifs);
		}
	};

	if (loading) {
		return (
			<Box>
				<Grid container>

					<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

						<LeftMenu setUser={setUser} user={user} />

					</Toolbar>
					<Grid item xs>
						<Container className="container mt-4">
							<Typography variant="h4" gutterBottom>
								Applications
							</Typography>
							<Box className="text-center">
								<CircularProgress />
							</Box>
						</Container>
					</Grid>
				</Grid>
			</Box>
		);
	}

	return (
		<Box>
			<Grid container>
				<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

					<LeftMenu setUser={setUser} user={user} />

				</Toolbar>

				<Grid item xs>
					<Container className="container mt-4">
						<Box className="notifContainer">
							<Badge badgeContent={notifs.length} color="primary">
								<Notifications
									onClick={() => { setNotifOpen(!notifOpen) }}
									color="primary"
									className="fs-2"
									style={{ cursor: "pointer" }}
								/>
							</Badge>
							{notifOpen && notifs?.map((notif, index) => (
								<Alert
									key={index}
									severity={"info"}
									className="mt-2 notifAlert"
									style={{ fontFamily: "cursive" }}
									onClose={() => handleNotifClose(notif._id)}
								>
									{notif.message}
								</Alert>
							))}
						</Box>
						<Typography
							variant="h4"
							gutterBottom
							className="fw-bold"
							style={{ fontFamily: "cursive" }}
						>
							Applications
						</Typography>
						<Box>
							{applications.length === 0 ? (
								<Typography>No Applications Yet</Typography>
							) : (
								<TableContainer component={Paper} className="mb-4">
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Course
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Status
													</Typography>
												</TableCell>
												<TableCell>
													<Typography
														variant="h6"
														style={{ fontFamily: "cursive" }}
														className="fw-bold"
													>
														Action
													</Typography>
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{console.log(applications)}
											{applications.map((application, index) => (
												<TableRow key={index}>
													<TableCell>
														<Typography
															variant="button"
															style={{ fontFamily: "cursive" }}
															className="fs-6"
														>
															{application.course}
														</Typography>
													</TableCell>
													<TableCell>
														{application?.status === "Rejected" && <img src={Rejected} alt="Status Icon" style={{ marginRight: '5px', width: '80px', height: '80px' }} />}

														{/* <Chip
															label={application.status.toUpperCase()}
															className="text-white fw-bold"
															color={`${getStatusBGColor(application.status)}`}
														/> */}
														{application?.status === "Pending" && <img src={Pending} alt="Status Icon" style={{ marginRight: '5px', width: '70px', height: '70px' }} />}
														{application?.status === "Approved" && <img src={Approved} alt="Status Icon" style={{ marginRight: '5px', width: '70px', height: '70px' }} />}
														{application?.status === "Accepted" && <img src={Accepted} alt="Status Icon" style={{ marginRight: '5px', paddingRight: "25px", width: '100px', height: '100px' }} />}
														{application?.status === "In Review" && <img src={InReview} alt="Status Icon" style={{ marginRight: '5px', width: '70px', height: '70px' }} />}
													</TableCell>
													<TableCell>
														{application.status === "Approved" && (
															<>
																<Button
																	// variant="contained"
																	// color="success"
																	style={{ marginRight: "20px", width: "90px", height: "90px" }}
																	onClick={() =>
																		handleAccept(
																			application.id,
																			application.index,
																			index,
																			"Accepted"
																		)
																	}
																>
																	<img src={Allow} alt="Status Icon" style={{ marginRight: '5px', width: '120px', height: '120px' }} />
																</Button>
																<Button
																	// variant="contained"
																	// style={{ color: "white", backgroundColor: "red" }}
																	onClick={() =>
																		handleAccept(
																			application.id,
																			application.index,
																			index,
																			"Rejected"
																		)
																	}
																>
																	<img src={Reject} alt="Status Icon" style={{ marginRight: '5px', width: '120px', height: '120px' }} />
																</Button>
															</>

														)}
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							)}
						</Box>
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ApplicationList;
