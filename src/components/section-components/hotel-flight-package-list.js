import React, {Component, setState, useEffect, useRef, useState} from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import FlightHotelPackageItem from '../flights/flight_hotel_package_item';
import paginate from '../flights/paginate_flight_hotel_package';
import { Slider } from '@material-ui/core';
import { setGlobalState, useGlobalState } from '../../index'
import API_URL from "../auth/helper";

const HotelFlightPackageList = () => {

  // constructor() {
  //   super();
  //   this.state = {
  //     destination: "",
  //     origin: "",
  //     departure_date: "",
  //     return_date: "",
  //     departure_time_sort: "down",
  //     departure_time_sort_text: "Departure Time High to Low",
  //     price_sort: "down",
  //     price_sort_text: "Price High to Low",
  //     loading: false,
  //     hotelFlightPackageList: [],
  //     pageNumber: 0,
  //     paginated_data: [],
  //     priceRange: [10, 50000],
  //     starRating: '',
  //     hotelName: '',
  //     conpleteList: [],
  //     filteredData: [],
  //     accomodationType: ''
  //   };
  // };

  const [values, setValues] = useState({
    departure_date: "",
    departure_time_sort: "down",
    departure_time_sort_text: "Departure Time High to Low",
    price_sort: "down",
    price_sort_text: "Price High to Low",
    loading: false,
    pageNumber: 0,
    priceRange: [10, 50000],
    starRating: '',
    hotelName: '',
    accomodationType: '',
    heyNow: 'NOPE'
  });

  const { accomodationType, hotelName,
    starRating, priceRange, pageNumber, loading, price_sort_text, price_sort,
    departure_time_sort_text, departure_time_sort, heyNow
  } = values;


  useEffect(() => {
    setValues({ ...values, error: false, destination: destination, origin: origin,
      departure_date: departureDate, return_date: return_date });
    console.log("hey this ran")
    searchCacheFlightHotelsPackage()

  }, [])


  const toggleLoading = () => {
    // setState(state => ({
    //   loading: !state.loading
    // }));
    console.log("toggleloading ran")
    setValues({ ...values, error: false, loading: !loading});
  }

  const zeroIfNull = (val) => {
    if (typeof val === "undefined" || val == "undefined") {
      return 0;
    }
    console.debug(typeof val, "is expecting a string");
    return Number(val);
  }

  const [destination] = useGlobalState("destination_code")
  const [origin] = useGlobalState("origin")
  const [return_date] = useGlobalState("return_date")
  const [adults] = useGlobalState("adults")
  const [children] = useGlobalState("children")
  const [days] = useGlobalState("days")
  const [departureDate] = useGlobalState("departure_date");
  const [countryCode] = useGlobalState("country_code");
  const [currency] = useGlobalState("currency");
  const [destinationCode] = useGlobalState("destination_code");
  const [hotelCode] = useGlobalState("hotel_destination")


  const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  const getCacheFlightHotelsPackage = () => {
    const updatedInbound = addDays(departureDate,days);
    var user_details = localStorage.getItem("jwt");
    var user_id = 1;
    if (user_details) {
      user_id = JSON.parse(user_details)["id"];
    }

    console.log({
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "originplace": origin,
        "destinationplace": destination,
        "outbounddate": departureDate,
        "inbounddate": '2022-04-06',
        "rooms": 1,
        "adults": zeroIfNull(adults),
        "children": children,
        "country": countryCode,
        "currency_format": currency,
        "locale": "EN",
        "destination_code": hotelCode,
        "trip_days":  zeroIfNull(days),
        "number_of_extended_months": localStorage.getItem("searchForMonths") == 'true' ? 2 : 0,
        "user_id": user_id
      })
    })

    return fetch(`${API_URL}flights/cache-flight-hotels-package/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "originplace": origin,
        "destinationplace": destination,
        "outbounddate": departureDate,
        "inbounddate": "2022-03-06",
        "rooms": 1,
        "adults": zeroIfNull(adults),
        "children": zeroIfNull(children),
        "country": countryCode,
        "currency_format": currency,
        "locale": "EN",
        "destination_code": hotelCode,
        "trip_days":  days,
        "number_of_extended_months": localStorage.getItem("searchForMonths") == 'true' ? 2 : 0,
        "user_id": user_id
      })
    })
        .then(function(response){
          return response.json();
        })
        .catch((err) => { return err });
  };

  let paginated_data = [];

  let completeList = [];

  let filteredData = [];

  let hotelFlightPackageList = [];

  const searchCacheFlightHotelsPackage = () => {
    setValues({ ...values, loading: true });
    console.log("loaidng is" + loading)
    // const destination = localStorage.getItem("flight_destination");
    // const origin = localStorage.getItem("flight_origin");
    // const departure_date = localStorage.getItem("flight_departure_date");
    // const return_date = localStorage.getItem("flight_return_date");
    getCacheFlightHotelsPackage()
        .then((data) => {
          console.log(data.list)
          console.log(data.list.length)
          if (data.list.length > 0) {
            const result = paginate(data.list);
            //setValues({ ...values, error: false, paginated_data: result, completeList: data.list, filteredData: data.list, hotelFlightPackageList: result[pageNumber] });
            paginated_data = result;
            completeList = data.list;
            filteredData = data.list;
            hotelFlightPackageList = result[pageNumber];
          } else {
            console.log("sorry no packages found========");
          }
          // console.log(completeList)
          // console.log(filteredData)
          // console.log(hotelFlightPackageList)
          // console.log(paginated_data)
          setValues({ ...values, loading: false });
        })
        .catch((e) => {
          console.log("packages data error=======", e);
          setValues({ ...values, loading: false });
        });

  }


    // setState({
    //   destination: destination, origin: origin,
    //   departure_date: departure_date, return_date: return_date
    // });

  // this.searchCachedFlights();
    //searchCacheFlightHotelsPackage();




  const loadingMessage = () => {
    return (
      loading && (
        <div className="preloader" id="preloader">
          <div className="preloader-inner">
            <div className="spinner">
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          </div>
        </div>
      )
    );
  };

  const inputChangedHandler = (event) => {
    setValues({ ...values, error: false, [event.target.name]: event.target.value });
  }

  const handleSliderChange = (e, val) => {
    setValues({ ...values, error: false, priceRange: val });
    filterAndSort();
  }

  const handleFilter = (e) => {
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
    filterAndSort()
  }

  const sortSearchResultsBasedOnPrices = (event) => {
    setTimeout(() => {
      let price = price_sort;
      const newList = filteredData;
      if (price === "down") {
        setValues({ ...values, error: false, price_sort_text: "Price Low to High", price_sort: "up" });
        newList.sort((first, second) => (first.deal_price > second.deal_price ? 1 : -1));
      }
      if (price === "up") {
        setValues({ ...values, error: false, price_sort: "down", price_sort_text: "Price High to Low" });
        newList.sort((first, second) => (first.deal_price < second.deal_price ? 1 : -1));
      }
      setValues({ ...values, error: false, filteredData: newList });
      const result = paginate(newList);
      setValues({ ...values, error: false, paginated_data: result });
      setValues({ ...values, error: false, pageNumber: 0 });
      setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });

    }, 100)
  }

  const sortSearchResultsBasedOnDepartureTime = (event) => {
    let departure_time = departure_time_sort;
    const newList = filteredData;

    if (departure_time === "down") {
      setValues({ ...values, error: false, departure_time_sort: "up", departure_time_sort_text: "Departure Date Low to High" });
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() > new Date(second.outbounddate).getTime() ? 1 : -1));
    } else {
      setValues({ ...values, error: false, departure_time_sort: "down", departure_time_sort_text: "Departure Date High to Low" });
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() < new Date(second.outbounddate).getTime() ? 1 : -1));

    }
    setValues({ ...values, error: false, filteredData: newList });
    const result = paginate(newList);
    setValues({ ...values, error: false,paginated_data: result });
    setValues({ ...values, error: false, pageNumber: 0 });
    setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });
  }

  const filterAndSort = () => {
    setTimeout(() => {
      let priceRange = priceRange;
      let star = starRating;
      let type = accomodationType;
      let name = hotelName;
      let list = completeList || [];
      console.log('list is' + list)
      let alist = list.filter(r =>
        parseFloat(r.deal_price) <= parseInt(priceRange[1])
        && parseFloat(r.deal_price) >= parseInt(priceRange[0])
        && (r.hotel_object.type || '').toUpperCase().includes(type)
        && (r.hotel_object.rating || '').toString().includes(`${star}`)
        && (r.hotel_object.hotel || '').toLowerCase().includes((name || '').toLocaleLowerCase())
      )
      setValues({ ...values, error: false, filteredData: alist });
      const result = paginate(alist);
      setValues({ ...values, error: false, paginated_data: result });
      setValues({ ...values, error: false, pageNumber: 0 });
      setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });

    }, 100)
  }

  const handlePage = (index) => {
    setValues({ ...values, error: false, pageNumber: index, hotelFlightPackageList: paginated_data[pageNumber] });
  }

  const nextPage = () => {
    let nextPage = pageNumber + 1
    if (nextPage > paginated_data.length - 1) {
      nextPage = 0
    }
    setValues({ ...values, error: false, pageNumber: nextPage, hotelFlightPackageList: paginated_data[nextPage] });
  }

  const prevPage = () => {
    let prevPage = pageNumber - 1
    if (prevPage < 0) {
      prevPage = paginated_data.length - 1
    }
    setValues({ ...values, error: false, pageNumber: prevPage, hotelFlightPackageList: paginated_data[prevPage] });
  }

  let publicUrl = process.env.PUBLIC_URL + '/'
  let imagealt = 'image'

  const flight = () => {
    return (
        !loading && (
        <div className="tour-list-area">
          {hotelFlightPackageList.map((flightDetails) => {
            return <FlightHotelPackageItem key={flightDetails.outbounddate} {...flightDetails} />
          })};
        </div>
    )
  )
  };

  return(

    <div className="tour-list-area pd-top-120 viaje-go-top">
      <div className="container">
        {loadingMessage()}
        <div className="row">
          <div className="col-xl-9 col-lg-8 order-lg-12">
            <div className="tp-tour-list-search-area">
              <div className="row">
                <div className="col-xl-4 col-sm-6">
                  <a className="btn btn-yellow" style={{ color: 'white' }}
                    onClick={sortSearchResultsBasedOnPrices}>
                    <i className={"la la-arrow-" + price_sort} />
                    {price_sort_text}
                  </a>
                </div>
                <div className="col-xl-4 col-sm-6">
                  <a className="btn btn-yellow" style={{ color: 'white' }}
                    onClick={sortSearchResultsBasedOnDepartureTime}>
                    <i className="la la-arrow-down" />
                    {departure_time_sort_text}
                  </a>
                </div>
                {/* <div className="col-xl-4 col-sm-6">
                  <label className="single-input-wrap">
                    <i className="fa fa-paper-plane" />
                    <input type="text" placeholder="Name (A - Z)" />
                  </label>
                </div> */}
              </div>
            </div>
            {flight()}
            <div className="text-md-center text-left">
              <div className="tp-pagination text-md-center text-left d-inline-block mt-4">
                <ul>
                  <li><a className="prev page-numbers" onClick={prevPage}><i className="la la-long-arrow-left" /></a></li>
                  {paginated_data.map((item, index) => {
                    return (
                      <li key={`k1${index}`}><a className="page-numbers" onClick={() => handlePage(index)}>{index + 1}</a></li>
                    )
                  })}
                  <li><a className="next page-numbers" onClick={nextPage}><i className="la la-long-arrow-right" /></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 order-lg-1">
            <div className="widget tour-list-widget">
              <div className="form-group has-success has-feedback">
                <label>Search Hotel Name</label>
                <input type="text" className="form-control" id="inputSuccess2" name="hotelName" onChange={handleFilter} />
                <span className="glyphicon glyphicon-ok form-control-feedback"></span>
              </div>
              <div className="form-group has-success has-feedback">
                <label ><i className="fa fa-star" /> Hotel Rating</label>
                <select className="form-control" name="starRating" onChange={handleFilter}>
                  <option value="">All</option>
                  <option value="0">Un stared</option>
                  <option value="1">1 Start</option>
                  <option value="2">2 Start</option>
                  <option value="3">3 Start</option>
                  <option value="4">4 Start</option>
                  <option value="5">5 Start</option>
                </select>
              </div>
              <div className="form-group has-success has-feedback">
                <label >Price Filter</label>
                <Slider
                  getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                  defaultValue={priceRange}
                  name="priceRange" onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  // getAriaValueText={'valuetext'}
                  min={10}
                  max={100000}
                />
              </div>
              <div className="form-group has-success has-feedback">
                <label>Accomodation Type</label>
                <select className="form-control" name="accomodationType" onChange={handleFilter}>
                  <option value="">All</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="HOSTEL">Hostel</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
}

export default HotelFlightPackageList