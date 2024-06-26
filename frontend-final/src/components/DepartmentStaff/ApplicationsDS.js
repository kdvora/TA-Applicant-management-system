import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "../../styles/ApplicationsDS.css";
import {
	Box,
	Button,
	Card,
	CircularProgress,
	Container,
	Grid,
	Modal,
	Typography,
	Toolbar
} from "@mui/material";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Chip } from "@mui/joy";
import { useEffect, useState } from "react";
import axios from "axios";
import { LeftMenu } from "./Utils";
import CV from '../../utils/ct.png'
import Recommended from '../../utils/recomm.png'

const CourseChip = ({ course, index, onToggle, isSelected }) => {
	const handleClick = () => {
		onToggle(course);
	};

	return (
		<Chip
			color={"success"}
			variant={isSelected ? "solid" : "soft"}
			className="me-3"
			// endDecorator={isSelected && <Check />}
			onClick={handleClick}
			key={index}
		>
			{course}
		</Chip>
	);
};

const PreviousTAChip = (props) => {
	return (
		<Chip color="neutral" variant="solid" className="me-3" key={props.index}>
			{props.course}
		</Chip>
	);
};

const ConfirmationModal = ({ open, onClose, onConfirm }) => {
	return (
		<Modal
			open={open}
			onClose={onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={{ p: 4 }} className="modalBox">
				<Typography id="modal-modal-title" variant="h6" component="h2">
					Confirm Recommendation
				</Typography>
				<Typography id="modal-modal-description" sx={{ mt: 2 }}>
					Are you sure you want to recommend this applicant to the TA Committee
					with the selected courses?
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						mt: 3,
					}}
				>
					<Button sx={{ mr: 1 }} variant="outlined" onClick={onClose}>
						No, go back
					</Button>
					<Button variant="contained" color="error" onClick={onConfirm}>
						Yes, confirm
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

const ApplicationCard = ({
	application,
	setApplications,
	index,
	isOpen,
	setIsOpen,
}) => {
	const [openConfirmation, setOpenConfirmation] = useState(false);
	const [applicantIdToReview, setApplicantIdToReview] = useState(null);

	const handleReview = (applicantId) => {
		if (application.DSCourses.length === 0) {
			alert("Please select at least one course to recommend");
			return;
		}
		setApplicantIdToReview(applicantId);
		setOpenConfirmation(true);
	};

	const confirmReview = async () => {
		setOpenConfirmation(false);
		try {
			const response = await axios.put(
				`http://localhost:4000/api/updateApplicant/${applicantIdToReview}`,
				{
					...application,
					review: true,
					status: application.status.map((st) => {
						if (st === "Pending") {
							return "Rejected";
						}
						return st;
					}),
				}
			);
			setApplications((prevApplications) =>
				prevApplications.map((applicant) => {
					if (applicant.id === applicantIdToReview) {
						return {
							...applicant,
							review: true,
						};
					}
					return applicant;
				})
			);
			alert(response.data.message);
			console.log(response.data.message);
		} catch (error) {
			console.error("Error rejecting the application:", error);
		}
	};

	const toggleCourseSelection = (course) => {
		setApplications((prevApplications) => {
			const newApplications = [...prevApplications];
			const targetedApplication = newApplications[index];
			const courseIndex = targetedApplication.DSCourses.indexOf(course);
			const cIndex2 = targetedApplication.eligibleCourses.indexOf(course);
			if (courseIndex > -1) {
				targetedApplication.DSCourses.splice(courseIndex, 1);
				targetedApplication.status[cIndex2] = "Pending";
			} else {
				targetedApplication.DSCourses.push(course);
				targetedApplication.status[cIndex2] = "In Review";
			}
			newApplications[index] = { ...targetedApplication };
			return newApplications;
		});
	};

	const handleSave = async (applicationId, updatedData) => {
		try {
			console.log(applicationId, updatedData)
			const response = await axios.put(
				`http://localhost:4000/api/updateApplicant/${applicationId}`,
				updatedData
			);
			alert("Application saved successfully");
			console.log("Save successful", response.data);
		} catch (error) {
			console.error("Error saving application:", error);
		}
	};

	const downloadFile = async (filename) => {
		try {
			console.log('resumename', filename)
			filename = filename.substring(8);
			console.log('next', filename)
			const response = await axios.get(`http://localhost:4000/api/download-resume/${filename}`, {
				responseType: "blob",
			});

			const file = new Blob([response.data], {
				type: "application/octet-stream",
			});

			const downloadUrl = window.URL.createObjectURL(file);
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.setAttribute("download", `${application.name}-resume.pdf`);
			document.body.appendChild(link);
			link.click();

			link.parentNode.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	return (
		<Card className="px-3 py-2 mb-3 " style={{ backgroundColor: "white", color: "black", borderRadius: "20px", width: "80%", margin: "10px auto" }} key={index} variant="outlined" >
			{console.log(application, "app")}
			<Box className="d-flex align-items-center justify-content-between">
				<Typography variant="h6" className="">
					{application?.znumber}
				</Typography>
				<Typography variant="h6" className="">
					{application.name}
				</Typography>
				<Typography variant="body1" className="ms-2">
					{application.email}
				</Typography>
				<Button
					variant="text"
					color="primary"
					onClick={() => downloadFile(application.resume)}
				>
					<img src={CV} alt="Status Icon" style={{ width: '50px', height: '50px' }} />
				</Button>
				<Box className="d-flex align-items-center">
					<Button
						variant="contained"
						className="me-2"
						color={"success"}
						onClick={() => handleReview(application._id)}
						disabled={application.review}
					>
						{`${application?.review ? "Recommended" : "Recommend"}`}
					</Button>
					<ConfirmationModal
						open={openConfirmation}
						onClose={() => setOpenConfirmation(false)}
						onConfirm={confirmReview}
					/>
					<Box
						className="ms-3 applicationCard"
						onClick={() => {
							if (isOpen === index) {
								setIsOpen(-1);
							} else {
								setIsOpen(index);
							}
						}}
					>
						{isOpen === index ? (
							<ArrowDropUp className="fs-3" />
						) : (
							<ArrowDropDown className="fs-3" />
						)}
					</Box>
				</Box>
			</Box>
			{isOpen === index && (
				<Box className="mt-3">
					{/* COURSES */}
					<Typography variant="body1" className="fw-bold">
						Courses{" "}
						<span className="fw-light">
							(Select courses to recommend to TA Committee)
						</span>
					</Typography>
					<Box className="mt-2 d-flex">
						{application.eligibleCourses?.map((course, index) => {
							return (
								<CourseChip
									course={course}
									index={index}
									onToggle={toggleCourseSelection}
									isSelected={application.DSCourses?.includes(course)}
									key={index}
								/>
							);
						})}
					</Box>
					{/* PREVIOUS TEACHING ASSISTANT COURSES  */}
					{application.previousTACourses.length > 0 && (
						<>
							<Typography variant="body1" className="fw-bold mt-3">
								Previous Teaching Assistant Courses
							</Typography>
							<Box className="mt-2 d-flex">
								{application.previousTACourses?.map((course, index) => {
									return (
										<PreviousTAChip course={course} index={index} key={index} />
									);
								})}
							</Box>
						</>
					)}
					{!application.review && (
						<Box className="d-flex justify-content-end mt-3">
							<Button
								variant="contained"
								color="primary"
								onClick={() => handleSave(application._id, application)}
							>
								Save
							</Button>
						</Box>
					)}
				</Box>
			)}
		</Card>
	);
};

const ApplicationsDS = ({ setUser, user }) => {
	const [applications, setApplications] = useState([]);
	const [isOpen, setIsOpen] = useState(-1);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchApplicants = async () => {
			try {
				const response = await axios.get("http://localhost:4000/api/getApplicants");
				setApplications(response.data);
				setLoading(false);
			} catch (error) {
				console.error("There was an error fetching the applicants:", error);
			}
		};

		fetchApplicants();
	}, []);

	return (
		<Box >

			<Grid container spacing={1}>
				<Toolbar style={{ backgroundColor: "#1DA1F2", width: "100%" }}>

					<LeftMenu setUser={setUser} user={user} />
				</Toolbar>
				<Grid item className="mx-5 pt-5" xs style={{ height: "100vh" }}>
					<Typography
						variant="h4"
						className="fw-bold"
						style={{ display: "flex", justifyContent: "flex-end", fontStyle: "italic" }}
					>
						Welcome {user.username}, <Button variant="contained" style={{ margin: "20px", color: "white", backgroundColor: "#1DA1F2" }} >
							Department Staff
						</Button>
					</Typography>
					<Typography
						variant="h6"
						className="mt-2"
						style={{ fontFamily: "italic", color: "black" }}
					>
						<h3>{applications.length} Applicants</h3>
					</Typography>
					<Container className="mt-4 applicationRightBox application-ds">
						{loading ? (
							<Box className="d-flex justify-content-center align-items-center h-100">
								<Typography variant="h3" className="fw-bold">
									<CircularProgress />
								</Typography>
							</Box>
						) : (

							applications.map((application, index) => {
								return (
									// <Card style={{ backgroundColor: "white", color: "black", width: "80%", margin: '10px auto' }}>
									<ApplicationCard
										application={application}
										setApplications={setApplications}
										index={index}
										isOpen={isOpen}
										setIsOpen={setIsOpen}
										key={index}
									/>
									// </Card>
								);
							})

						)}
					</Container>
				</Grid>
				<Grid item md={2} xs={0} />
			</Grid>
		</Box>
	);
};

export default ApplicationsDS;
