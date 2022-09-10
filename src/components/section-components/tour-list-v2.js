import React, {Component, setState, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import API_URL, { getFlightsDestinationAutoSuggestion, searchHotelBeds } from '../auth/helper';
import FlightOfflineItem from '../flights/flightoffline_item';
import LiveFlightItem from '../flights/live_flight_item';
import LiveFlightItemCheapest from '../flights/live_flight_item_cheapest';
import paginate from '../flights/paginate_flight_hotel_package';
import { Slider } from '@material-ui/core';
import { setGlobalState, useGlobalState } from '../../index'

const TourListV2 = () => {

  const [values, setValues] = useState({
    price_sort: "down",
    price_sort_text: "Price High to Low",
    loading: false,
    pageNumber: 0,
    paginated_data: [],
    filteredData: [],
    completeList: [],
    cachedFlightsList: [1, 2, 3, 4, 5],
    maxStopage: 1,
    carriers: '',
    price: [1, 100000],
    booking: {},
    tries: 0,
  });


  const {price_sort, price_sort_text, loading, pageNumber, paginated_data, filteredData, completeList, cachedFlightsList, maxStopage, carriers, price, booking, tries
  } = values;

  const [isLocal] = useGlobalState("isLocal")

  const [destination] = useGlobalState("destination_code")
  const [origin] = useGlobalState("origin")
  const [return_date] = useGlobalState("return_date")
  const [departureDate] = useGlobalState("departure_date");
  const [isReturn] = useGlobalState("isReturn")
  const [children] = useGlobalState("children")
  const [adults] = useGlobalState("adults")
  const [country_code] = useGlobalState("country_code")
  const [currency] = useGlobalState("currency")

  let [flightsPaginated_data] = useGlobalState("flightsPaginated_data")
  let [flightsFilteredData] = useGlobalState("flightsFilteredData")
  let [liveFlightsList] = useGlobalState("liveFlightsList");
  let [flightsCompleteList] = useGlobalState("flightsCompleteList");
  let [currencySymbol] = useGlobalState("currencySymbol");
  let [liveFlightAttempts] = useGlobalState("liveFlightAttempts");


  useEffect(() => {
    // const destination = localStorage.getItem("flight_destination");
    // const origin = localStorage.getItem("flight_origin");
    // const departure_date = localStorage.getItem("flight_departure_date");
    // const return_date = localStorage.getItem("flight_return_date");
    // this.searchCachedFlights();
    setGlobalState("return_date", convertDate(JSON.parse(localStorage.getItem('hotel_details')).flightDetails.inbounddate))
    console.log("WE are searching for flights now")
    console.log("here are values")
    console.log("return date is")
    console.log(return_date)
    console.log("return date is")
    console.log(return_date)
    searchLiveFlights();
  },[])

  useEffect(() => {
    if (liveFlightsList.length > 0) {
      console.log("inside use effect pagenumber is " + pageNumber)
      setGlobalState("liveFlightsList", paginated_data[pageNumber])
    }

  }, [pageNumber])

  const toggleLoading = () => {
    setValues({ ...values, error: false, loading: !loading});
  }

  // const searchCachedFlights = () => {
  //   toggleLoading();
  //   // const destination = localStorage.getItem("flight_destination");
  //   // const origin = localStorage.getItem("flight_origin");
  //   // const departure_date = localStorage.getItem("flight_departure_date");
  //   // const return_date = localStorage.getItem("flight_return_date");
  //   getFlightsDestinationAutoSuggestion({
  //     destination, origin,
  //     departure_date, return_date
  //   })
  //     .then((data) => {
  //       if (data.length > 0) {
  //         this.setState({ cachedFlightsList: data });
  //       } else {
  //         console.log("sorry no flights found========");
  //       }
  //
  //     })
  //     .catch((e) => console.log("flights data error=======", e));
  //   this.toggleLoading();
  // }

    const convertDate = (newDate) => {
	let today = new Date(newDate);


    let MyDateString = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    return MyDateString
    }

 const getLiveFlights = () => {
    let user_details = localStorage.getItem("jwt");
    let user_id = 1;
    if (user_details) {
      user_id = JSON.parse(user_details)["id"];
    }
    console.log("BELOW IS DEPARTURE DATE")
    console.log(JSON.parse(localStorage.getItem('hotel_details')).flightDetails.outbounddate)

     console.log("below is flightDetails")
     console.log(JSON.parse(localStorage.getItem('hotel_details')).flightDetails)

       var jsonData = {
      "originplace": origin,
      "destinationplace": destination,
      "outbounddate": convertDate(JSON.parse(localStorage.getItem('hotel_details')).flightDetails.outbounddate),
      ...(isReturn && { "inbounddate": convertDate(JSON.parse(localStorage.getItem('hotel_details')).flightDetails.inbounddate) }),
      "children": Number(children),
      "adults": Number(adults),
      "country": country_code,
      "currency": currency,
      "locale": "en-US",
      "user_id": user_id
    }

    // var jsonDataOLD = {
    //   "originplace": localStorage.getItem("origin"),
    //   "destinationplace": localStorage.getItem("destination"),
    //   "outbounddate": JSON.parse(localStorage.getItem('hotel_details')).flightDetails.outbounddate,
    //   ...(isReturn && { "inbounddate": convertDate(departureDate) }),
    //   "children": Number(localStorage.getItem("children")),
    //   "adults": Number(localStorage.getItem("adults")),
    //   "country": localStorage.getItem("country_code"),
    //   "currency": localStorage.getItem("currency"),
    //   "locale": "en-US",
    //   "user_id": user_id
    // }
    console.log("jsonData")
    console.log(jsonData)
    // if (localStorage.getItem("return_date").toString().trim(' ') != "") {
    //   jsonData['return_date'] = localStorage.getItem("return_date").toString()
    // }

    return fetch(`${API_URL}flights/live-flight-prices/`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'User-id': 1 },
      body: JSON.stringify(jsonData)
    })
        .then((response) => {
          return response.json();
        })
        .catch((err) => { return err });
  };

    const getLiveFlightsLocal=()=>{
    return fetch('liveFlightsResponse.json'
    ,{
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
      )
        .then(function(response){
          return response.json();
        })
        .catch((err) => { return err });
  }

    const getLiveFlightsSwitch = () => {
    if (isLocal)
      return getLiveFlightsLocal()
    else {
      return getLiveFlights()
    }
  }


  const searchLiveFlights = () => {
    //toggleLoading();
    setValues({ ...values, loading: true });
    console.log("loading first is" + loading)
    getLiveFlightsSwitch()
      .then((data) => {
        // console.log("data=========", data)
        if (data.list.length > 0) {
          let result = data.list;
          if (data.list.length > 10) {
            result = paginate(data.list);

            for (let i = 0; i < data.list.length; i++) {
              flightsCompleteList.push(data.list[i])
              flightsFilteredData.push(data.list[i])
            }

            for (let i = 0; i < result[pageNumber].length; i++) {
              liveFlightsList.push(result[pageNumber][i])
            }

            for (let i = 0; i < result.length; i++) {
              paginated_data.push(result[i])
            }

            currencySymbol = data.currency
          } else {
            // this.setState({
            //   currencySymbol: data.currency,
            //   paginated_data: [result],
            //   filteredData: data.list,
            //   completeList: data.list,
            //   liveFlightsList: result
            // })
            //FIND OUT WHAT ABOVE WAS DOING
          }
          // console.log("result=========", result)
          // console.log("page number=========", this.state.pageNumber)
          
          // const currencySymbol = data.currency;
          
          let b = localStorage.getItem('bookingDetails')
          if (!!b) {
            let d = JSON.parse(b);
            // this.setState({ booking: JSON.parse(b) });
            setValues({ ...values, error: false, booking: JSON.parse(b)});
            // this.setState({ carriers: d.flight });
            setValues({ ...values, error: false, carriers: d.flight});
            //this.state.carriers = d.flight;
            if (liveFlightsList.length > 10) {
              filterAndSort()
            }
          }
        } else {
          console.log("sorry no flights found========");
        }
        setValues({ ...values, loading: false });
        //setValues({ ...values, error: false, loading: !loading});
      })
      .catch((e) => {
        console.log("flights data error=======", e);
        if(liveFlightAttempts < 3) {
          console.log("we trying again fam")
          console.log("tries is " + liveFlightAttempts)
            searchLiveFlights();
            setGlobalState("liveFlightAttempts", liveFlightAttempts++)
        } else {
          setValues({...values, loading: false});
        }
      });
  }

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

  const inputChangedHandler = (name) => (event) => {
    //this.setState({ [name]: event.target.value });
    setValues({ ...values, [name]: event.target.value});

  }

  const handlePage = (index) => {
    // this.setState({
    //   pageNumber: index,
    //   liveFlightsList: this.state.paginated_data[this.state.pageNumber] || []
    // });
    setValues({ ...values, pageNumber: index});
    //liveFlightsList = paginated_data[pageNumber] || []
    // this.setState({});
  }

  const nextPage = () => {
    let nextPage = pageNumber + 1
    if (nextPage > paginated_data.length - 1) {
      nextPage = 0
    }
    // this.setState({
    //   pageNumber: nextPage,
    //   liveFlightsList: this.state.paginated_data[nextPage] || []
    // })
    setValues({ ...values, error: false, pageNumber: nextPage});
    setGlobalState("liveFlightsList", paginated_data[nextPage])
  }

  const prevPage = () => {
    let prevPage = pageNumber - 1
    if (prevPage < 0) {
      prevPage = paginated_data.length - 1
    }
    // this.setState({
    //   pageNumber: prevPage,
    //   liveFlightsList: this.state.paginated_data[prevPage] || []
    // })

    setValues({ ...values, error: false, pageNumber: prevPage,});
    setGlobalState("liveFlightsList", liveFlightsList[prevPage])
  }

  const sortSearchResultsBasedOnPrices = (event) => {
    setTimeout(() => {
      let price = price_sort;
      const newList = flightsFilteredData;
      console.log("below is newlist")
      console.log(newList)
      if (price === "down") {

        setGlobalState("flights_price_sort_text", "Price Low to High")
        setGlobalState("flights_price_sort", "up")

        newList.sort((f, second) => (f.rate > second.rate ? 1 : -1));
      }
      if (price === "up") {
        setGlobalState("flights_price_sort", "down")
        setGlobalState("flights_price_sort_text", "Price High to Low")
        newList.sort((f, second) => (f.rate < second.rate ? 1 : -1));
      }

      const result = paginate(newList);
      console.log("below is result")
      console.log(result)

      setValues({ ...values, error: false, pageNumber: 0 });
      setGlobalState("flightsPaginated_data", result)
      setGlobalState("liveFlightsList", result[0])
    }, 100)
  }

  const filterAndSort = () => {
    setTimeout(() => {
      console.log(flightsCompleteList)
      let alist = flightsCompleteList.filter(r =>
        parseFloat(r.price) <= parseInt(price[1])
        && parseFloat(r.price) >= parseInt(price[0])
        && (r.carriers || '').toUpperCase().includes((carriers || '').toUpperCase())
        && (!!maxStopage ? r.number_of_stops <= maxStopage : true)
      )
      //this.setState({ filteredData: alist });
      console.log("below is alist")
      console.log(alist)
      setGlobalState("flightsFilteredData", alist)
      sortSearchResultsBasedOnPrices();
    }, 100)
  }

  const handleSliderChange = (e, val) => {
    //this.setState({ price: val });
    setValues({ ...values, error: false, price: val });
    filterAndSort();
  }

 const handleFilter = (e) => {
    //this.state[e.target.name] = e.target.value;
    setValues({ ...values, error: false, [e.target.name]: e.target.value });
   filterAndSort();
  }

  const flight = () => {
    let publicUrl = process.env.PUBLIC_URL + '/'
    let imagealt = 'image'
    let flight;
    let flightsPageNumbersListing;

    console.log("below is flight object")
    console.log(liveFlightsList[0])
    if (liveFlightsList.length == 0 ) {
      return (
          <div className="tour-list-area">
            {cachedFlightsList.map((flightDetails) => {
              return <FlightOfflineItem key={flightDetails.id} {...flightDetails} />
            })}
          </div>
      )
    } else {
      return (
          <div className="tour-list-area">
            {liveFlightsList.map((flightDetails) => {
              // console.log("flightsDetails========", flightDetails)
              flightDetails.currencySymbol = currencySymbol
              if (flightDetails.cheapest != null) {
                return <LiveFlightItemCheapest key={flightDetails.id} {...flightDetails} />
              } else {
                  const outbound = convertDate(JSON.parse(localStorage.getItem('hotel_details')).flightDetails.outbounddate)
                  console.log("This be is outbound date")
                  console.log(outbound)
                return <LiveFlightItem key={flightDetails.id} {...flightDetails} {...outbound}/> //need to throw in inbound and return date in here
              }

            })}
          </div>
      )
      // if (completeList.length > 10) {
      //   flightsPageNumbersListing =
      //       <div>
      //         {liveFlightsList.map((item, index) => {
      //           return (
      //               <li key={`item_${index}`}><a
      //                   className={"page-numbers " + (this.state.pageNumber == index ? "current" : "")}
      //                   onClick={() => handlePage(index)}>{index + 1}</a></li>
      //           )
      //         })}
      //       </div>
      // }
    }
  }

  const flightsPageNumbersListing = () => {
    if (flightsCompleteList.length > 10) {
      return (
          <div>
            {liveFlightsList.map((item, index) => {
              return (
                  <li key={`item_${index}`}><a
                      className={"page-numbers " + (pageNumber == index ? "current" : "")}
                      onClick={() => handlePage(index)}>{index + 1}</a></li>
              )
            })}
          </div>
      )
    }

  }

    return (
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
              </div>
            </div>
            {flight()}
            <div className="text-md-center text-left">
              <div className="tp-pagination text-md-center text-left d-inline-block mt-4">
                <ul>
                  <li><a className="prev page-numbers" onClick={prevPage}><i className="la la-long-arrow-left" /></a></li>
                  {flightsPageNumbersListing()}
                  <li><a className="next page-numbers" onClick={nextPage}><i className="la la-long-arrow-right" /></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 order-lg-1">
            <div className="sidebar-area">
              <div className="widget tour-list-widget">
                <div className="widget-tour-list-search">
                  <form className="search-form_">
                    <div className="form-group has-success has-feedback">
                      <label>Carrier</label>
                      <input type="text" className="form-control" id="inputSuccess2" name="carriers"
                        onChange={handleFilter} defaultValue={booking.flight} />
                      <span className="glyphicon glyphicon-ok form-control-feedback"></span>
                    </div>

                    <div className="form-group has-success has-feedback">
                      <label >Price Filter</label>
                      <Slider
                        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                        defaultValue={price}
                        name="price" onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        // getAriaValueText={'valuetext'}
                        min={10}
                        max={12000}
                      />
                    </div>

                    <div className="form-group has-success has-feedback">
                      <label>Max Stoppage</label>
                      <input type="number" className="form-control" name="maxStopage" onChange={handleFilter} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
)
}

export default TourListV2