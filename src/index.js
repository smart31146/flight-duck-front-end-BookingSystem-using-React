import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, HashRouter, Route, Switch } from "react-router-dom";
import HomeV1 from './components/home-v1';
import HomeV2 from './components/home-v2';
import HomeV3 from './components/home-v3';
import AboutUs from './components/about';
import TourList from './components/tour-list';
import TourListV2 from './components/tour-list-v2';
import HotelListPage from './components/hotel-list';
import FlightHotelPackage from './components/flight-hotel-package';
import TourListV3 from './components/tour-list-v3';
import TourDetails from './components/tour-details';
import DestinationLIst from './components/destination-list';
import DestinationLIstV2 from './components/destination-list-v2';
import DestinationDetails from './components/destination-details';
import Gallery from './components/gallery';
import GalleryDetails from './components/gallery-details';
import Faq from './components/faq';
import Contact from './components/contact';
import Error from './components/error';
import CommingSoon from './components/comming-soon';
import UserProfile from './components/user-profile';
import Blog from './components/blog';
import BlogV2 from './components/blog-v2';
import BlogV3 from './components/blog-v3';
import BlogDetails from './components/blog-details';
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';
import ForgotPassword from './components/auth/forgotpassword';
import PrivateRoutes from "./components/auth/helper/PrivateRoutes";
import HotelBooking from './components/section-components/hotel-booking';
import BookingConfirmationDetailsPage from './components/booking-confirmation-details';
import { BasicProvider } from "./BasicContext";
import { createGlobalState } from 'react-hooks-global-state';

export const { setGlobalState, useGlobalState } = createGlobalState({
	country_code: '',
	currency: '',
	destination: "",
	destination_code: "",
	hotel_destination: "",
	origin: "",
	departure_date: "",
	return_date: "",
	adults: null,
	children: null,
	//suggestions: [],
	// keyValue: "",
	// destinationName: "",
	// error: "",
	// errorMessage: "Check all fields again",
	// alert: null,
	days: null,
	isReturn: true,
	paginated_data: [],
	completeList: [],
	filteredData: [],
	hotelFlightPackageList: [],
	price_sort: "down",
	price_sort_text: "Price High to Low",
	departure_time_sort: "down",
	departure_time_sort_text: "Departure Time High to Low",
	pageNumber: 0,
	priceRange: [10, 5000],
	hotelName: '',
	accommodationType: '',
	currencySymbol: "",
	flightsPaginated_data: [],
	flightsFilteredData: [],
	flightsCompleteList: [],
	liveFlightsList: [],
	flights_price_sort: "down",
	flights_price_sort_text: "Price High to Low",
	currencyOptions: [
		{ value: 'AUD' },
		{ value: 'USD' },
		{ value: 'NZD' },
		{ value: 'EUR' },
		{ value: 'GPB' },
		{ value: 'CAN' },
		{ value: 'JPY' },
		{ value: 'INR' },
		{ value: 'CNY' },

	],
	selectedCurrency: "AUD",
	liveFlightAttempts: 0,
});

class Root extends Component {

	componentDidMount() {
		fetch(
			'https://ipapi.co/json/', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
			.then(resp => resp.json())
			.then((resp) => {
				localStorage.setItem("country_code", resp.country_code);
				localStorage.setItem("currency", resp.currency);
				setGlobalState("country_code", resp.country_code)
				setGlobalState("currency", resp.currency)
			})
	}

    render() {
        return(
			<HashRouter basename="/">
				<BasicProvider>
				<div>
					<Switch>
						<Route exact path="/" component={HomeV1} />
						<Route path="/home-v2" component={HomeV2} />
						<Route path="/home-v3" component={HomeV3} />
						<Route path="/about" component={AboutUs} />
						<Route path="/tour-list" component={TourList} />
						<Route path="/tour-list-v2" component={TourListV2} />
						<Route path="/hotel-list" component={HotelListPage} />
						<Route path="/hotel-booking" component={HotelBooking} />
						<Route path="/flight-hotel-package" component={FlightHotelPackage} />
						<Route path="/tour-list-v3" component={TourListV3} />
						<Route path="/tour-details" component={TourDetails} />
						<Route path="/destination-list" component={DestinationLIst} />
						<Route path="/destination-list-v2" component={DestinationLIstV2} />
						<Route path="/destination-details" component={DestinationDetails} />
						<Route path="/gallery" component={Gallery} />
						<Route path="/gallery-details" component={GalleryDetails} />
						<Route path="/faq" component={Faq} />
						<Route path="/contact" component={Contact} />
						<Route path="/error" component={Error} />
						<Route path="/comming-soon" component={CommingSoon} />
						<Route path="/blog" component={Blog} />
						<Route path="/blog-v2" component={BlogV2} />
						<Route path="/blog-v3" component={BlogV3} />
						<Route path="/blog-details" component={BlogDetails} />
						<Route path="/signin" component={SignIn} />
						<Route path="/signup" component={SignUp} />
						<Route path="/forgot-password" component={ForgotPassword} />
						<Route path="/booking-confirmation" component={BookingConfirmationDetailsPage} />
						<PrivateRoutes path="/user-profile" component={UserProfile} />
					</Switch>
				</div>
				</BasicProvider>
			</HashRouter>
        )
    }
}

export default Root;

ReactDOM.render(<Root />, document.getElementById('viaje'));
