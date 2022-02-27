import React , { Component, useState, useEffect, useRef } from 'react';
import { Link, Redirect, withRouter, Route, useHistory } from 'react-router-dom';
import parse from 'html-react-parser';
import API_URL, { getFlightsDestinationAutoSuggestion, searchHotelBeds } from '../auth/helper';
import Button from '@material-ui/core/Button';
import TourListV2 from '../../components/tour-list-v2';
import { makeStyles } from '@material-ui/core/styles';
import {
	saveFlightsSearchDataToLocalStorage,
	savePackageSearchDataToLocalStorage,
	saveHotelSearchDataToLocalStorage
} from "../auth/helper/index";
import 'react-dropdown/style.css';
// import DatePicker from 'react-date-picker';
//import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import { addMonths } from 'date-fns';
import Moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import SweetAlert from 'react-bootstrap-sweetalert';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const Search = (props) => {
	let history = useHistory();
	const classes = useStyles();
	const [searchForMonths, setSearchForMonths] = useState(false);
	const [originList, originListData] = useState([]);
	const [destinationList, destinationListData] = useState([]);
	const [departureDate, setDepartureDate] = useState(null);
	const [returnDate, setReturnDate] = useState(null);

	useEffect(() => {
		const country_code = localStorage.getItem("country_code")
		const url = `${API_URL}flights/get-airport-code/?country=${country_code}`
		fetch(
			url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		).then(resp => resp.json()).then((resp) => {
			originListData(resp['list'])
			destinationListData(resp['list'])
		})
	}, [])


	const [values, setValues] = useState({
		destination: "",
		origin: "",
		departure_date: "",
		return_date: "",
		selectedOption: "flight",
		adults: "",
		numberOfRooms: "",
		suggestions: [],
		keyValue: "",
		destinationName: "",
		error: "",
		errorMessage: "Check all fields again",
		alert: null,
		days: null,
		// originList: []
	});

	const [value, setValue] = React.useState(new Date());

	const {destination, origin, departure_date, return_date,
		adults, children, daysOptions, selectedDayOption,
		numberOfRooms, suggestions, keyValue, destinationName,
		error, errorMessage, alert, days
		// originList
	} = values;

	const hideAlert = (event) => {
		setValues({ ...values, alert: null, error: false });
	}

	const errorAlertDialog = () => {
		return (
			error && (
				<SweetAlert
					danger
					title="Error"
					onConfirm={hideAlert}
				>
					{errorMessage}
				</SweetAlert>
			)
		);
	};

	function updateOriginList() {
		fetch(
			`${API_URL}flights/get-airport-code/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		)
			.then(resp => resp.json()
			)
			.then((resp) => {
				setValues({ ...values, error: false, originList: resp['list'] });
			})
	}


	const handleChange = (name) => (event) => {
		setValues({ ...values, error: false, [name]: event.target.value });
		if (name === "destination") {
			const url = `${API_URL}flights/get-airport-code/?query=${event.target.value}`
			fetch(
				url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
				.then(resp => resp.json()
				)
				.then((resp) => {
					destinationListData(resp['list'])
				})
		} else if (name === "origin") {
			const url = `${API_URL}flights/get-airport-code/?query=${event.target.value}`
			fetch(
				url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
				.then(resp => resp.json()
				)
				.then((resp) => {
					originListData(resp['list'])
				})
		}
	};

	const handleRadioChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value });
	};

	const onFlightSearchFormSubmit = (event) => {
		event.preventDefault();
		if (returnDate != null) {
			// if (returnDate < departureDate) {
			// 	setValues({
			// 		...values,
			// 		error: true,
			// 		errorMessage: "Return Date should be greater than Departure Date"
			// 	});
			// 	return;
			// } else {
				const destination_code = destinationList.find((dest) => dest.airport_name === destination).airport_code;
				const origin_code = originList.find((org) => org.airport_name === origin).airport_code;
				const updatedDepartureDate = Moment(departureDate).format(Moment.HTML5_FMT.DATE);
				const updatedReturnDate = Moment(returnDate).format(Moment.HTML5_FMT.DATE);

				saveFlightsSearchDataToLocalStorage({
					destination_code, origin_code, updatedDepartureDate,
					updatedReturnDate, adults, children
				});
				localStorage.removeItem("only_flight");
				localStorage.setItem("only_flight", "true");
				history.push("/tour-list-v2");
			// }
		}
		else {
			const destination_code = destinationList.find((dest) => dest.airport_name === destination).airport_code;
			const origin_code = originList.find((org) => org.airport_name === origin).airport_code;
			const updatedDepartureDate = Moment(departureDate).format(Moment.HTML5_FMT.DATE);

			saveFlightsSearchDataToLocalStorage({
				destination_code, origin_code,
				updatedDepartureDate, adults, children
			});
			localStorage.removeItem("only_flight");
			localStorage.setItem("only_flight", "true");
			history.push("/tour-list-v2");
		}
	};

	const onHotelSearchFormSubmit = (event) => {
		event.preventDefault();
		if (returnDate != null) {
			// if (returnDate < departureDate) {
			// 	setValues({
			// 		...values,
			// 		error: true,
			// 		errorMessage: "Return Date should be greater than Departure Date"
			// 	});
			// 	return;
			// } else {
				const hotelDestinationCode = destinationList.find((dest) => dest.city__city_name === destination).city__city_code;
				const updatedDepartureDate = Moment(departureDate).format(Moment.HTML5_FMT.DATE);
				const updatedReturnDate = Moment(returnDate).format(Moment.HTML5_FMT.DATE);

				saveHotelSearchDataToLocalStorage({
					hotelDestinationCode,
					updatedDepartureDate, updatedReturnDate,
					adults, numberOfRooms
				});
				localStorage.removeItem("only_hotel");
				localStorage.setItem("only_hotel", "true");
				history.push("/hotel-list");
			// }
		}
		else {
			const hotelDestinationCode = destinationList.find((dest) => dest.city__city_name === destination).city__city_code;
			const updatedDepartureDate = Moment(departureDate).format(Moment.HTML5_FMT.DATE);

			saveHotelSearchDataToLocalStorage({
				hotelDestinationCode, updatedDepartureDate, adults,
				children, numberOfRooms
			});
			localStorage.removeItem("only_hotel");
			localStorage.setItem("only_hotel", "true");
			history.push("/hotel-list");
		}

	};

	const onSearchFlightHotelPackageFormSubmit = (event) => {
		event.preventDefault();
		if (destination === origin) {
			setValues({
				...values,
				error: true,
				errorMessage: "Destination and Origin cannot be same"
			});
			return;
		}
		// if (returnDate < departureDate) {
		// 	setValues({
		// 		...values,
		// 		error: true,
		// 		errorMessage: "Return Date should be greater than Departure Date"
		// 	});
		// 	return;
		// } else {
			const destinationCode = destinationList.find((dest) => dest.airport_name === destination).airport_code;
			const originCode = originList.find((org) => org.airport_name === origin).airport_code;
			const hotelDestinationCode = destinationList.find((dest) => dest.airport_name === destination).city__city_code;
			const updatedDepartureDate = Moment(departureDate).format(Moment.HTML5_FMT.DATE);
			const updatedReturnDate = Moment(returnDate).format(Moment.HTML5_FMT.DATE);

			savePackageSearchDataToLocalStorage({
				destinationCode, originCode,
				updatedDepartureDate, hotelDestinationCode,
				updatedReturnDate, adults, children,
				searchForMonths, days
			});
			localStorage.removeItem("only_hotel");
			localStorage.removeItem("only_flight");
			localStorage.setItem("only_hotel", "false");
			history.push("/flight-hotel-package");
		// }
	};

	const date = new Date();

	const minDate = new Date(date.getFullYear(), date.getMonth(), 1);

	const maxDate = date.setMonth(date.getMonth()+16);

	const packageHtml =
		<form onSubmit={onSearchFlightHotelPackageFormSubmit}>
			<div className="row">
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input type="text" className="w-100"
							list="data1" placeholder="Where To?"
							   value={destination}
							   onChange={handleChange("destination")}
							required
						/>
						<datalist id="data1">
							<select>
								{
									destinationList.map(originItem => {
										return (
											<option key={`o${originItem.airport_name}`}>
												{originItem.airport_name}
											</option>
										)
									})
								}
							</select>
						</datalist>
						<i className="ti-location-pin" />
					</div>
				</div>
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input type="text" className="w-100"
							list="data2" placeholder="Where From?"
							value={origin}
							onChange={handleChange("origin")}
							required
						/>
						<datalist id="data2">
							<select>
								{
									originList.map(originItem => {
										return (
											<option key={`o2${originItem.airport_name}`}>
												{originItem.airport_name}
											</option>
										)
									})
								}
							</select>
						</datalist>
						<i className="ti-location-pin" />
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-users" />
						<input
							type="number"
							className="w-100"
							id="number"
							name="adults"
							placeholder="0"
							value={adults}
							min={0}
							onChange={handleChange("adults")}
							required
							title="Number of adults"
						/>
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-users" />
						<input
							id="number"
							type="number"
							className="w-100"
							name="children"
							placeholder="0"
							value={children}
							min={0}
							onChange={handleChange("children")}
							title="Number of children"
						/>
					</div>
				</div>
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<LocalizationProvider dateAdapter={AdapterDateFns}>
							<Stack spacing={3}>
								<DatePicker
									views={['month', 'year']}
									//label="Year and Month"
									minDate={minDate}
									maxDate={maxDate}
									value={departureDate}
									onChange={(date) => setDepartureDate(date)}
									renderInput={(params) => <TextField {...params} helperText={null} />}
								/>
							</Stack>
						</LocalizationProvider>
					</div>
				</div>
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input
							id="number"
							type="number"
							className="w-100"
							name="days"
							placeholder="Days"
							value={days}
							onChange={handleChange("days")}
							required
							title="Number of days"
							min={0}
						/>
						<i className="fa fa-calendar-minus-o" />
					</div>
				</div>
			</div>
			<div className="row mt-4 ml-1">
				<div className="col-lg-12 col-md-4 form-check form-check-inline">
					<input
						className="form-check-input" type="checkbox"
						name="inlineRadioOptions"
						onChange={(event) => setSearchForMonths(event.currentTarget.checked)}
						checked={searchForMonths} />
					<label className="form-check-label" htmlFor="inlineRadio1">
						Check if you want to search for complete month as well.
						(Flight and hotel package for upto 3 months only will be shown)
					</label>
				</div>
				<div className="col-xl-4 col-lg-9 offset-xl-4 offset-lg-1 mt-3">
					<input className="btn btn-yellow"
						type="submit" value="Find Hotels"
					// onClick={onSearchFlightHotelPackageFormSubmit}
					/>
				</div>
			</div>
		</form>


	const flightHtml =
		<form onSubmit={onFlightSearchFormSubmit}>
			<div className="row">
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input type="text" className="w-100"
							list="data1" placeholder="Where To?"
							value={destination}
							onChange={handleChange("destination")}
							required
						/>
						<datalist id="data1">
							<select>
								{
									destinationList.map(originItem => {
										return (
											<option key={`o3${originItem.airport_name}`}>
												{originItem.airport_name}
											</option>
										)
									})
								}
							</select>
						</datalist>
						<i className="ti-location-pin" />
					</div>
				</div>
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input type="text" className="w-100"
							list="data2" placeholder="Where From?"
							value={origin}
							onChange={handleChange("origin")}
							required
						/>
						<datalist id="data2">
							<select>
								{
									originList.map(originItem => {
										return (
											<option key={`o4${originItem.airport_name}`}>
												{originItem.airport_name}
											</option>
										)
									})
								}
							</select>
						</datalist>
						<i className="ti-location-pin" />
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-users" />
						<input
							type="number"
							className="w-100"
							id="number"
							name="adults"
							placeholder="0"
							value={adults}
							onChange={handleChange("adults")}
							required
							title="Number of adults"
						/>
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-users" />
						<input
							id="number"
							type="number"
							className="w-100"
							name="children"
							placeholder="0"
							value={children}
							onChange={handleChange("children")}
							title="Number of children"
						/>
					</div>
				</div>
				<div className="col-xl-4 col-lg-9 offset-xl-4 offset-lg-1 mt-3">
					<input className="btn btn-yellow" type="submit"
						value="Find Flights"
					/>
				</div>
			</div>
		</form>

	const hotelHtml =
		<form onSubmit={onHotelSearchFormSubmit}>
			<div className="row">
				<div className="col-lg-4 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<input type="text" className="w-100"
							list="data1" placeholder="Where To?"
							value={destination}
							onChange={handleChange("destination")}
							required
						/>
						<datalist id="data1">
							<select>
								{
									destinationList.map(originItem => {
										return (
											<option key={originItem.city__city_name}>
												{originItem.city__city_name}
											</option>
										)
									})
								}
							</select>
						</datalist>
						<i className="ti-location-pin" />
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-users" />
						<input
							id="number"
							type="number"
							className="w-100"
							name="adults"
							placeholder="0"
							value={adults}
							onChange={handleChange("adults")}
							required
							title="Number of adults"
						/>
					</div>
				</div>
				<div className="col-lg-1 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<i className="fa fa-key" />
						<input
							id="number"
							type="number"
							className="w-100"
							name="numberOfRooms"
							placeholder="0"
							value={numberOfRooms}
							onChange={handleChange("numberOfRooms")}
							required
							title="Number of rooms"
							min="1"
						/>
						{/* <i className="ti-key" /> */}
					</div>
				</div>
				<div className="col-xl-4 col-lg-9 offset-xl-4 offset-lg-1 mt-3">
					<input className="btn btn-yellow" type="submit" value="Find Hotels" />
				</div>
			</div>
		</form>

	function getFormData() {
		if (values.selectedOption === "flight") {
			return (flightHtml)
		} else if (values.selectedOption === "hotel") {
			return (hotelHtml)
		} else {
			return (packageHtml)
		}
	}

	const logoUrl = process.env.PUBLIC_URL + '/' + "assets/img/others/Big_logo.png"

	return (
		<div className="banner-area viaje-go-top">
			<div className="banner-slider">
				<div className="banner-slider-item banner-bg-1">
					<div className="container">
						<div className="row">
							<div className="col-xl-4 col-lg-9 offset-xl-4 offset-lg-1" style={{ height: '200px' }}>
								<Link className="ads-thumb" to="/contact">
									<img src={logoUrl} alt="ads" />
								</Link>
							</div>
							<div className="tp-main-search col-xl-10 col-lg-10 offset-xl-1 offset-lg-1" style={{ color: 'yellow' }}>
								<div>
									<div className="form-check form-check-inline">
										<input
											className="form-check-input" type="radio"
											name="inlineRadioOptions" value="flight"
											onChange={handleRadioChange("selectedOption")}
											checked={values.selectedOption == "flight"} />
										<label className="form-check-label" htmlFor="inlineRadio1">Flights</label>
									</div>
									<div className="form-check form-check-inline">
										<input
											className="form-check-input" type="radio"
											name="inlineRadioOptions" value="hotel"
											onChange={handleRadioChange("selectedOption")}
											checked={values.selectedOption == "hotel"} />
										<label className="form-check-label">Hotels Only</label>
									</div>
									<div className="form-check form-check-inline">
										<input
											className="form-check-input" type="radio"
											name="inlineRadioOptions" value="package"
											onChange={handleRadioChange("selectedOption")}
											checked={values.selectedOption == "package"} />
										<label className="form-check-label">Packages</label>
									</div>
								</div>
								<div style={{ background: '#ffffff2e', padding: '20px 40px' }} className="mt-1">
									{getFormData()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{errorAlertDialog()}
		</div>
	);
}

export default Search