import {
	Box,
	Button,
	Container,
	Grid,
	List,
	ListItem,
	ListItemText,
	Modal,
	Rating,
	TextField,
	Typography,
	Toolbar,
	Card,

} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";

const UserFeedbackModal = ({ user, open, onClose }) => {
	console.log("--------------------------------------")
	const [feedback, setFeedback] = useState("");
	const [rating, setRating] = useState(0);
	console.log("----------------------------------step1----------------------------------------", user)

	const handleClose = () => {
		setFeedback("");
		onClose();
	};


	const handleSubmit = async () => {
		try {
			console.log("user-------------------------------------------", user, feedback, rating)
			await axios.post("http://localhost:4000/api/createFeedback", {
				...user,
				feedback,
				rating,
			});

			alert("Feedback created successfully");
		} catch (error) {
			alert("Error creating feedback");
			console.error("Error creating feedback:", error);
		}
		handleClose();
	};

	return (
		<Modal open={open} onClose={handleClose}>
			<Container maxWidth="sm">
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "#1DA1F2",
						color: "white",
						boxShadow: 24,
						p: 4,
						width: "80vw",
						maxWidth: "400px",
					}}
				>
					<Typography
						style={{ fontFamily: "cursive" }}
						className="fw-bold"
						variant="h6"
					>
						User Information
					</Typography>
					{/* <Typography style={{ fontFamily: "cursive" }} variant="body1">
						Username: <strong>{user.username}</strong>
					</Typography> */}
					<Typography style={{ fontFamily: "cursive" }} variant="body1">
						Name: <strong>{user?.name}</strong>
					</Typography>
					<Typography style={{ fontFamily: "cursive" }} variant="body1">
						Email: <strong>{user?.email}</strong>
					</Typography>
					{/* <Typography style={{ fontFamily: "cursive" }} variant="body1">
						Course: <strong>{user.course}</strong>
					</Typography> */}
					<TextField
						label="Feedback"
						variant="outlined"
						fullWidth
						multiline
						rows={4}
						style={{ backgroundColor: "white" }}
						value={feedback}
						onChange={(e) => setFeedback(e.target.value)}
						className="mt-3"
					/>
					<Box>
						<Typography className="mt-3 fw-bold" style={{ fontFamily: "cursive" }}>
							Rating
						</Typography>
						<Rating
							name="rating"
							value={rating}
							onChange={(event, newValue) => {
								setRating(newValue);
							}}
						/>
					</Box>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						style={{ marginTop: "16px" }}
					>
						Submit Feedback
					</Button>
				</Box>
			</Container>
		</Modal>
	);
};

const Feedback = ({ setUser }) => {
	const [acceptedApplications, setAcceptedApplications] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [open, setOpen] = useState(false);

	const fillApplications = (apps) => {
		const newApplications = [];
		apps.forEach((app) => {
			app.eligibleCourses.forEach((course, index) => {
				if (app.status[index] === "Accepted") {
					newApplications.push({
						username: app.username,
						znumber: app.znumber,
						name: app.name,
						email: app.email,
						course,
					});
				}
			});
		});

		setAcceptedApplications(newApplications);
	};
	const handleFeedbackClick = (user) => {
		setSelectedUser(user);
		setOpen(true);
	};


	useEffect(() => {
		const fetchAcceptedApplications = async () => {
			try {
				const response = await axios.get("http://localhost:4000/api/getAcceptedApplications");
				fillApplications(response.data);
			} catch (error) {
				console.error("Error fetching accepted applications:", error);
			}
		};

		fetchAcceptedApplications();
	}, []);

	return (
		<Box>
			<Grid container>
				<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

					<LeftMenu setUser={setUser} />
				</Toolbar>
				<Grid item xs className="my-4">
					<Container className="container">
						<Typography
							variant="h4"
							gutterBottom
							style={{ fontFamily: "Serif" }}
							className="fw-bold"
						>
							Users with Eligible Courses Accepted
						</Typography>
						<List>
							<Card style={{ backgroundColor: "#1DA1F2", width: "80%", margin: '0px auto', borderRadius: "35px" }}>
								{console.log("-----------------------------------------------accepted", acceptedApplications)}

								{acceptedApplications.map((user, index) => (
									// <Card style={{ borderRadius: "30px" }}>

									< ListItem
										key={user.id}
										className="p-3 mb-3 shadow "
										style={{ backgroundColor: "white", width: "80%", margin: '10px auto', borderRadius: "30px" }}
									>
										<ListItemText

											primary={` Znumber : ${user?.znumber} , Name: ${user.name} (${user.username})`}
											secondary={`Email: ${user.email} | Course: ${user.course}`}
											primaryTypographyProps={{
												style: { fontFamily: "cursive" },
												className: "fw-bold",
											}}
											secondaryTypographyProps={{
												style: { fontFamily: "cursive" },
												className: "fw-bold",
											}}
										/>
										<Button
											variant="contained"
											color="primary"
											// onClick={() => setOpen(true)}
											onClick={() => handleFeedbackClick(user)}
											style={{ fontStyle: "italic" }}
										>
											Feedback
										</Button>


										<UserFeedbackModal
											user={selectedUser}
											open={open}
											onClose={() => setOpen(false)}
										/>

									</ListItem>
									// </Card>
								))}
							</Card>
						</List>
					</Container>
				</Grid>
			</Grid >
		</Box >
	);
};

export default Feedback;
