import {
	Container,
	Typography,
	Box,
	Grid,
	Chip,
	Rating,
	Button,
	AppBar,
	Toolbar,
	IconButton,
	Card,
	CardContent,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";
import {
	ArrowDropDown, ArrowDropUp, Article,
	SportsRugby
} from "@mui/icons-material";
import { NavLink, useNavigate, } from "react-router-dom";

const FeedbackList = ({ setUser, user }) => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [open, setOpen] = useState(-1);

	useEffect(() => {
		const fetchAllFeedbacks = async () => {
			try {
				const response = await axios.get(`http://localhost:4000/api/getFeedbacks/${user.username}`);

				if (response.status === 200) {
					setFeedbacks(response.data);
					console.log("Fetched feedbacks:", response.data);
				} else {
					console.error("Error fetching feedbacks:", response.statusText);
				}
			} catch (error) {
				console.error("Error fetching feedbacks:", error);
			}
		};

		fetchAllFeedbacks();
	}, [user]);

	return (
		<Box >
			{/* <AppBar position="static" style={{ backgroundColor: "rgb(255,255,255,0.9)" }}> */}
			<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

				<LeftMenu setUser={setUser} user={user} />

			</Toolbar>
			{/* </AppBar> */}
			<Grid container>
				<Grid item xs className="my-4">
					<Container className="container">
						<Typography
							variant="h4"
							gutterBottom
							style={{ fontFamily: "Cursive", color: "#000000" }}
							className="fw-bold"
						>
							All Feedbacks
						</Typography>
						{feedbacks.length === 0 ? (
							<Typography className="mt-4" style={{ fontFamily: "cursive", color: "#000000" }}>
								No Feedbacks Yet
							</Typography>
						) : (
							<Card style={{ backgroundColor: "rgb(0,0,255,0.1)", width: "80%", margin: '0px auto', borderRadius: "35px" }}>
								{feedbacks.map((feedback, index) => (
									<Card
										key={index}
										className="my-4 shadow p-3 "
										style={{ backgroundColor: "white", width: "90%", margin: '0px auto', borderRadius: "35px" }}

									>
										<Box className="d-flex align-items-center justify-content-between">
											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "Open Sans", fontStyle: "italic" }}
												className="me-5"
											>
												{feedback.username}
											</Typography>
											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "cursive" }}
												className="fw-bold me-5"
											>
												{feedback.name}
											</Typography>
											<Typography
												variant="subtitle2"
												gutterBottom
												style={{ fontFamily: "cursive", fontStyle: "italic" }}
												className="fw-bold"
											>
												{feedback.email}
											</Typography>
											<Button
												variant="text"
												color="primary"
												onClick={() =>
													open === index ? setOpen(-1) : setOpen(index)
												}
											>
												{open === index ? <ArrowDropUp /> : <ArrowDropDown />}
											</Button>
										</Box>
										{open === index && (
											<Box>
												<Chip
													label={feedback.course}
													style={{ fontFamily: "cursive", fontStyle: "italic" }}
													className="me-3 my-2"
													color="primary"
												/>
												<Box>
													<Rating
														name="rating"
														value={feedback.rating}
														readOnly
														className="my-2"
													/>
												</Box>
												<Typography
													variant="body1"
													gutterBottom
													style={{ fontFamily: "cursive", fontStyle: "italic" }}
													className="border p-2 mt-2"
												>
													{feedback.feedback}
												</Typography>
											</Box>
										)}
									</Card>
								))}
							</Card>
						)}
					</Container>
				</Grid>
			</Grid>
		</Box >
	);
};

export default FeedbackList;
