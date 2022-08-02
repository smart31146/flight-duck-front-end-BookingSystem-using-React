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

  const [values, setValues] = useState({
    loading: false,
    starRating: 'default',
    accommodationType: 'default',
    hotelName: 'default',
    pageNumber: 0,
    priceRange: [10, 5001],
  });

  const { loading, starRating, accommodationType, hotelName, pageNumber, priceRange
  } = values;


  useEffect(() => {
    // setValues({ ...values, error: false, destination: destination, origin: origin,
    //   departure_date: departureDate, return_date: return_date })


      searchCacheFlightHotelsPackage()


    console.log("inside useEffect paginated")
    console.log(paginated_data)


  }, [])

  useEffect(() => {


    if(starRating !== "default") {
      filterAndSort()
   }

    if(accommodationType !== "default") {
      filterAndSort()
    }
  }, [starRating, accommodationType, hotelName])

  useEffect(() => {

    if(hotelName !== "default") {
      console.log("hotel being run")
      filterAndSort()
    }

  }, [hotelName])

  useEffect(() => {

    const start = [10, 5001];
    if(priceRange.toString() !== start.toString()) {
      console.log("pricerange is " + priceRange)
      filterAndSort()
    }

  }, [priceRange])

  useEffect(() => {
    if (hotelFlightPackageList.length > 0) {
      console.log("inside use effect pagenumber is " + pageNumber)
      setGlobalState("hotelFlightPackageList", paginated_data[pageNumber])
    }

  }, [pageNumber])


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
  const [selectedCurrency] = useGlobalState("selectedCurrency");
  const [destinationCode] = useGlobalState("destination_code");
  const [hotelCode] = useGlobalState("hotel_destination")
  let [hotelFlightPackageList] = useGlobalState("hotelFlightPackageList")
  let [paginated_data] = useGlobalState("paginated_data")
  let [completeList] = useGlobalState("completeList")
  let [filteredData] = useGlobalState("filteredData")
  let [price_sort] = useGlobalState("price_sort")
  let [price_sort_text] = useGlobalState("price_sort_text")
  let [departure_time_sort] = useGlobalState("departure_time_sort")
  let [departure_time_sort_text] = useGlobalState("departure_time_sort_text");
  //let [pageNumber] = useGlobalState("pageNumber");
  //let [priceRange] = useGlobalState("priceRange");
  //let [starRating] = useGlobalState("starRating");
  //let [hotelName] = useGlobalState("hotelName");
  //let [accommodationType] = useGlobalState("accommodationType");



  const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const convertDate = (newDate) => {
	let today = new Date(newDate);


    let MyDateString = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    return MyDateString
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
        "outbounddate": convertDate(departureDate),
        "inbounddate": convertDate(departureDate),
        "rooms": 1,
        "adults": zeroIfNull(adults),
        "children": children,
        "country": countryCode,
        "currency_format": selectedCurrency,
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
        // "outbounddate": departureDate,
        "outbounddate": convertDate(departureDate),
        "inbounddate": convertDate(departureDate),
        "rooms": 1,
        "adults": zeroIfNull(adults),
        "children": zeroIfNull(children),
        "country": countryCode,
        "currency_format": selectedCurrency,
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


  const searchCacheFlightHotelsPackage = () => {
    setValues({ ...values, loading: true });
    let result = null;
    console.log("loading at start is" + loading)
    // const destination = localStorage.getItem("flight_destination");
    // const origin = localStorage.getItem("flight_origin");
    // const departure_date = localStorage.getItem("flight_departure_date");
    // const return_date = localStorage.getItem("flight_return_date");
    getCacheFlightHotelsPackage()
        .then((data) => {
          console.log("BELOW IS DATA RECIEVED")
          console.log(data.list)
          console.log(data.list.length)
          if (data.list.length > 0) {
            result = paginate(data.list);

            console.log("first is pagenuymber second is result")
            console.log(result[pageNumber])
            console.log(result)


            for (let i = 0; i < data.list.length; i++) {
              completeList.push(data.list[i])
              filteredData.push(data.list[i])
            }

            for (let i = 0; i < result[pageNumber].length; i++) {
              hotelFlightPackageList.push(result[pageNumber][i])
            }

            for (let i = 0; i < result.length; i++) {
              paginated_data.push(result[i])
            }

            console.log("BELOW IS PAGINATED AFTER FLAT")
            console.log(paginated_data)
            console.log("loading before set is" + loading)
          } else {
            console.log("sorry no packages found========");
          }
          console.log(hotelFlightPackageList)
          console.log("loading before set 2 is" + loading)
          setValues({ ...values, loading: false });
          console.log("loading after set is" + loading)
        })
        .catch((e) => {
          console.log("packages data error=======", e);
          setValues({ ...values, loading: false });
        });


    console.log("outside of fetch", hotelFlightPackageList)
    console.log("this is result")
    console.log(result)

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
    //setValues({ ...values, error: false, [event.target.name]: event.target.value });
    setGlobalState([event.target.name], event.target.value)
  }

  const handleSliderChange = (e, val) => {
    console.log("this is the price val" + val)
    console.log("this is being run")
    setValues({ ...values, error: false, priceRange: val });
  }

  const handleFilter = (e) => {
    //setValues({ ...values, error: false, [e.target.name]: e.target.value });
    console.log("this is " + [e.target.name][0])
    setValues({ ...values, error: false, [[e.target.name][0]]: e.target.value });

    //filterAndSort()
  }



  const sortSearchResultsBasedOnPrices = (event) => {
    setTimeout(() => {
      let price = price_sort;
      const newList = filteredData;
      console.log("below is list after being updated by price sort")
      console.log(newList)
      if (price === "down") {
        //setValues({ ...values, error: false, price_sort_text: "Price Low to High", price_sort: "up" });
        setGlobalState("price_sort_text", "Price Low to High")
        setGlobalState("price_sort", "up")
        newList.sort((first, second) => (first.deal_price > second.deal_price ? 1 : -1));
      }
      if (price === "up") {
        //setValues({ ...values, error: false, price_sort: "down", price_sort_text: "Price High to Low" });
        setGlobalState("price_sort", "down")
        setGlobalState("price_sort_text", "Price High to Low")
        newList.sort((first, second) => (first.deal_price < second.deal_price ? 1 : -1));
      }
      filteredData = newList;
      const result = paginate(newList);
      setGlobalState("paginated_data", result)
      console.log("below is result")
      console.log(result)

      setValues({ ...values, error: false, pageNumber: 0 });
      //setGlobalState("pageNumber", 0)
      //setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });



      console.log("this is result 0")
      console.log(result[0])
      setGlobalState("hotelFlightPackageList", (result[0] || []))
      console.log("after setting global state")
      console.log(hotelFlightPackageList)
      //hotelFlightPackageList = (result[0] || []);
      flight()

    }, 100)
  }

  const sortSearchResultsBasedOnDepartureTime = (event) => {
    let departure_time = departure_time_sort;
    const newList = filteredData;

    if (departure_time === "down") {
      //setValues({ ...values, error: false, departure_time_sort: "up", departure_time_sort_text: "Departure Date Low to High" });
      setGlobalState("departure_time_sort", "up");
      setGlobalState("departure_time_sort_text", "Departure Date Low to High");
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() > new Date(second.outbounddate).getTime() ? 1 : -1));
    } else {
      //setValues({ ...values, error: false, departure_time_sort: "down", departure_time_sort_text: "Departure Date High to Low" });
      setGlobalState("departure_time_sort", "down");
      setGlobalState("departure_time_sort_text", "Departure Date High to Low");
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() < new Date(second.outbounddate).getTime() ? 1 : -1));

    }
    filteredData = newList;
    const result = paginate(newList);
    setGlobalState("paginated_data", result)
    setValues({ ...values, error: false, pageNumber: 0 });
    //setGlobalState("pageNumber", 0);
    // setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });
    setGlobalState("hotelFlightPackageList", (result[0] || []))
  }

  const filterAndSort = () => {
    setTimeout(() => {
      let star = '';
      let type = accommodationType;
      let name = hotelName;

      if(starRating === "default") {
        star = '';
      } else {
        star = starRating;
      }

      if(accommodationType === "default") {
        type = '';
      } else {
        type = accommodationType;
      }

      if(hotelName === "default") {
        name = '';
      } else {
        name = hotelName;
      }

      let list = completeList || [];
      console.log('list is' + list)
      console.log("starrating is" + star)
      console.log("accommodationType is " + accommodationType)
      let alist = list.filter(r =>
        parseFloat(r.deal_price) <= parseInt(priceRange[1])
        && parseFloat(r.deal_price) >= parseInt(priceRange[0])
        && (r.hotel_object.type || '').toUpperCase().includes(type)
        && (r.hotel_object.rating || '').toString().includes(`${star}`)
        && (r.hotel_object.hotel || '').toLowerCase().includes((name || '').toLocaleLowerCase())
      )
      //TODO BELOW IS A VERY DIRTY FIX TO GET the cheapest prices showing for hotels
      alist.sort((first, second) => (first.deal_price > second.deal_price ? 1 : -1));
      filteredData = alist;
      console.log("filter list is now")
      console.log(alist)
      const result = paginate(alist);
      setGlobalState("paginated_data", result)
      //setGlobalState("paginated_data", result);
      setValues({ ...values, error: false, pageNumber: 0 });
      //setGlobalState("pageNumber", 0);
      // setValues({ ...values, error: false, hotelFlightPackageList: (result[0] || []) });
      //hotelFlightPackageList = (result[0] || [])
      setGlobalState("hotelFlightPackageList", (result[0] || []))



    }, 100)
  }

  const handlePage = (index) => {
    console.log("we are going to page number " + index)
    setValues({ ...values, error: false, pageNumber: index, });
    //setGlobalState("pageNumber", index);
    console.log("we are on page number " + pageNumber)
    //hotelFlightPackageList = paginated_data[pageNumber];
  }

  const nextPage = () => {
    let nextPage = pageNumber + 1
    if (nextPage > paginated_data.length - 1) {
      nextPage = 0
    }
    setValues({ ...values, error: false, pageNumber: nextPage});
    //setGlobalState("pageNumber", nextPage);
    //hotelFlightPackageList = paginated_data[nextPage];
    setGlobalState("hotelFlightPackageList", paginated_data[nextPage])
  }

  const prevPage = () => {
    let prevPage = pageNumber - 1
    if (prevPage < 0) {
      prevPage = paginated_data.length - 1
    }
    setValues({ ...values, error: false, pageNumber: prevPage,});
    //setGlobalState("pageNumber", prevPage);
    //hotelFlightPackageList = paginated_data[prevPage];
    setGlobalState("hotelFlightPackageList", paginated_data[prevPage])
  }

  const flight = () => {
    console.log("BELOW IS INSIDE FLIGHT()")
    console.log(hotelFlightPackageList)

    console.log("below is pagniated data")
    console.log(paginated_data.length)
    // if(paginated_data.length === 1) {
    //   paginated_data = paginated_data[0]
    // }
    console.log(paginated_data)

    // paginated_data.map((item, index) => {
    //   console.log("below is pagniated data")
    //   console.log(paginated_data)
    //   return (
    //       <li key={`k1${index}`}><a className="page-numbers" onClick={() => handlePage(index)}>{index + 1}</a></li>
    //   )
    // })

    let arr = [];

    if(hotelFlightPackageList.length > 0) {
      for (let i = 0; i < hotelFlightPackageList.length; i++) {
        arr.push(<FlightHotelPackageItem
            key={hotelFlightPackageList[i].outbounddate + i} {...hotelFlightPackageList[i]} />)
      }
    }
    console.log("below is arr")
    console.log(arr)
    return (
        <div className="tour-list-area">
          {arr.map((packageDetails) => {
            return packageDetails
          })};
        </div>

    )
  };


  // return (
    //     <div className="tour-list-area">
    //       {hotelFlightPackageListTest.map((flightDetails) => {
    //         console.log(flightDetails)
    //         return <FlightHotelPackageItem key={flightDetails.outbounddate} {...flightDetails} />
    //       })};
    //     </div>

  // )

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
                  {paginated_data.length > 0 ? paginated_data.map((item, index) => {
                    console.log("below is pagniated data")
                    console.log(paginated_data)
                    return (
                      <li key={`k1${index}`}><a className="page-numbers" onClick={() => handlePage(index)}>{index + 1}</a></li>
                    )
                  }) : null }
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
                    key={`slider-${priceRange}`}
                    getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                  value={priceRange}
                  name="priceRange" onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  // getAriaValueText={'valuetext'}
                  min={10}
                  max={5000}
                />
              </div>
              <div className="form-group has-success has-feedback">
                <label>Accomodation Type</label>
                <select className="form-control" name="accommodationType" onChange={handleFilter}>
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