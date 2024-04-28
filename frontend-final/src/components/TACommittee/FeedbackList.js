import {
	Container,
	Typography,
	Box,
	Grid,
	Chip,
	Rating,
	Button,
	Toolbar,
	Card
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { LeftMenu } from "./Utils";
import axios from "axios";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

const FeedbackList = ({ setUser }) => {
	const [feedbacks, setFeedbacks] = useState([]);
	const [open, setOpen] = useState(-1);

	useEffect(() => {
		const fetchAllFeedbacks = async () => {
			try {
				console.log("----------commitment-----------")
				const response = await axios.get("http://localhost:4000/api/getAllFeedbacks", { headers: { "Authorization": localStorage.getItem('token') } });

				if (response.status === 200) {
					console.log("feedback response success")
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
	}, []);

	return (
		<Box>
			<Grid container >
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
							All Feedbacks
						</Typography>
						{feedbacks.length === 0 ? (
							<Typography className="mt-4" style={{ fontFamily: "cursive" }}>
								No Feedbacks Yet
							</Typography>
						) : (
							<Box>
								{/* <Card style={{ backgroundColor: "rgb(0,0,255,0.1)", width: "60%", margin: '0px auto', borderRadius: "35px" }}> */}

								{feedbacks.map((feedback, index) => (
									<Card
										key={index}
										className="my-4 shadow p-3 rounded"
										style={{ backgroundColor: "rgb(0,0,255,0.4)", width: "80%", margin: '0px auto', borderRadius: "30px" }}
									>
										<Card className="d-flex align-items-center justify-content-between" style={{ borderRadius: "30px", width: "90%" }}>
											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "cursive" }}
												className="me-5"
											>
												{feedback?.a}
											</Typography>

											<Typography
												variant="body1"
												gutterBottom
												style={{ fontFamily: "cursive" }}
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
												style={{ fontFamily: "cursive" }}
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
										</Card>
										{open === index && (
											<Box>
												<Chip
													label={feedback.course}
													style={{ fontFamily: "cursive" }}
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
													style={{ fontFamily: "cursive" }}
													className="border p-2 mt-2"
												>
													{feedback.feedback}
												</Typography>
											</Box>
										)}
									</Card>
								))}
								{/* </Card> */}
							</Box>
						)}
					</Container>
				</Grid>
			</Grid>
		</Box>
	);
};

export default FeedbackList;
