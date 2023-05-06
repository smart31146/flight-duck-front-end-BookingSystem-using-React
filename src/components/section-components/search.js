import React, { Component, useState, useEffect, useCallback, useRef } from 'react';
import { Link, Redirect, withRouter, Route, useHistory } from 'react-router-dom';
import parse from 'html-react-parser';
import API_URL, { getFlightsDestinationAutoSuggestion, searchHotelBeds } from '../auth/helper';
import Button from '@material-ui/core/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import { addMonths } from 'date-fns';
import Moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import SweetAlert from 'react-bootstrap-sweetalert';
import { DebounceInput } from 'react-debounce-input';
import { setGlobalState, useGlobalState } from '../../index'

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

const printGlobalState = (destination, origin, departureDate, return_date, adults, children, days ) => {

	console.log("destination is " + destination)
	console.log("origin is " + origin)
	console.log("return_date is " + return_date)
	console.log("adults is " + adults)
	console.log("chuldren is " + children)
	console.log("departureDate is " + departureDate)
	console.log("days is " + days)
}

const printGlobalState2 = (isReturn) => {
	console.log("return is " + isReturn)
}


const Search = () => {
	localStorage.setItem("cachedHotelFlightPackageList", null);
	localStorage.setItem("packageDetails", null);
	setGlobalState("liveFlightsList", [])
	setGlobalState("hotelFlightPackageList", [])
	const [destination] = useGlobalState("destination")
	const [origin] = useGlobalState("origin")
	const [departureDate] = useGlobalState("departure_date")
	const [return_date] = useGlobalState("return_date")
	const [adults] = useGlobalState("adults")
	const [children] = useGlobalState("children")
	const [days] = useGlobalState("days")
	const [currency_format] = useGlobalState("selectedCurrency")
	const [isReturn] = useGlobalState("isReturn")
	console.log('globalstate print in SEARCH function')
	printGlobalState(destination, origin, departureDate, return_date, adults, children, days, currency_format)
	printGlobalState2(isReturn)


	let history = useHistory();
	const classes = useStyles();
	const [searchForMonths, setSearchForMonths] = useState(false);
	const [originList, originListData] = useState([]);
	const [destinationList, destinationListData] = useState([]);
	//const [departureDate, setDepartureDate] = useState(null);
	const [returnDate, setReturnDate] = useState(null);
	const [isLocal] = useGlobalState("isLocal")

	useEffect(() => {
		if(!isLocal) {
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
		}
	}, [])


	const [values, setValues] = useState({
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

	const { daysOptions, selectedDayOption,
		numberOfRooms, suggestions, keyValue,
		error, errorMessage, alert
		// originList
	} = values;

	const hideAlert = (event) => {
		setValues({ ...values, error: false, alert: null, });
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
		console.log("execution of Handlechange")
		console.log(name, event.target.value)
		setGlobalState(name, event.target.value)
		setValues({ ...values, error: false, [name]: event.target.value });
		if(!isLocal) {
			if (name === "destination") {
				console.log("this is pre destination API req")
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
				console.log("this is origin API fetch")
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
			console.log("this is post ALL API CALL")
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
				updatedReturnDate, adults, children, currency_format
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
				updatedDepartureDate, adults, children, currency_format
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
				adults, numberOfRooms, currency_format
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
				children, numberOfRooms, currency_format
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

		setGlobalState("destination_code", destinationCode)
		setGlobalState("origin", originCode)
		setGlobalState("hotel_destination", hotelDestinationCode)
		setGlobalState("departure_date", updatedDepartureDate)
		setGlobalState("return_date", updatedReturnDate)
		console.log("This is the currecny format")
		console.log(currency_format)

		savePackageSearchDataToLocalStorage({
			destinationCode, originCode,
			updatedDepartureDate, hotelDestinationCode,
			updatedReturnDate, adults, children,
			searchForMonths, days, currency_format
		});
		localStorage.removeItem("only_hotel");
		localStorage.removeItem("only_flight");
		localStorage.setItem("only_hotel", "false");

		history.push("/flight-hotel-package");
		// }
	};

	const date = new Date();

	const minDate = new Date(date.getFullYear(), date.getMonth(), 1);

	const maxDate = date.setMonth(date.getMonth() + 16);

	const handleSearch = (field, value) => {
		console.log("ran once")
		setValues({ ...values, error: false, [field]: value });
		handleChange(field)({ target: { value } });
		// Add the search function here that updates the originList or destinationList based on the input
	};

	function debounce(func, wait) {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	}

	const debouncedHandleSearch = debounce(handleSearch, 300);

	const packageHtml =
		<form onSubmit={onSearchFlightHotelPackageFormSubmit}>
			<div className="row">
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<DebounceInput
							minLength={0}
							debounceTimeout={400}
							input type="text" className="w-100"
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
				<div className="col-lg-3 col-md-4">
					<div className="tp-search-single-wrap" style={{ background: 'white' }}>
						<DebounceInput
							minLength={0}
							debounceTimeout={400}
							input type="text" className="w-100"
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
									onChange={(date) => setGlobalState("departure_date", date)}
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
						onChange={() => setGlobalState("isReturn", !isReturn)}
						checked={isReturn} />
					<label className="form-check-label" htmlFor="inlineRadio1">
						Return?
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
						<DebounceInput
							minLength={1}
							debounceTimeout={400}
							input type="text" className="w-100"
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
						<DebounceInput
							minLength={1}
							debounceTimeout={400}
							input type="text" className="w-100"
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
						<DebounceInput
							minLength={1}
							debounceTimeout={400}
							input type="text" className="w-100"
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
								<Link className="ads-thumb" to="">
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