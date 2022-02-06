import React, { Component, setState } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import { getFlightsDestinationAutoSuggestion, getLiveFlights, searchHotelBeds } from '../auth/helper';
import FlightOfflineItem from '../flights/flightoffline_item';
import LiveFlightItem from '../flights/live_flight_item';
import LiveFlightItemCheapest from '../flights/live_flight_item_cheapest';
import paginate from '../flights/paginate_flight_hotel_package';
import { Slider } from '@material-ui/core';

class TourListV2 extends Component {

  constructor() {
    super();
    this.state = {
      destination: "",
      origin: "",
      departure_date: "",
      return_date: "",
      price_sort: "down",
      price_sort_text: "Price High to Low",
      loading: false,
      pageNumber: 0,
      paginated_data: [],
      filteredData: [],
      completeList: [],
      cachedFlightsList: [1, 2, 3, 4, 5],
      liveFlightsList: [],
      currencySymbol: "",
      maxStopage: 1,
      carriers: '',
      price: [1, 100000],
      booking: {}
    };
  };

  componentDidMount() {
    const destination = localStorage.getItem("flight_destination");
    const origin = localStorage.getItem("flight_origin");
    const departure_date = localStorage.getItem("flight_departure_date");
    const return_date = localStorage.getItem("flight_return_date");
    this.setState({
      destination: destination, origin: origin,
      departure_date: departure_date, return_date: return_date
    });
    // this.searchCachedFlights();
    this.searchLiveFlights();
  }

  toggleLoading() {
    this.setState(state => ({
      loading: !state.loading
    }));
  }

  searchCachedFlights() {
    this.toggleLoading();
    const destination = localStorage.getItem("flight_destination");
    const origin = localStorage.getItem("flight_origin");
    const departure_date = localStorage.getItem("flight_departure_date");
    const return_date = localStorage.getItem("flight_return_date");
    getFlightsDestinationAutoSuggestion({
      destination, origin,
      departure_date, return_date
    })
      .then((data) => {
        if (data.length > 0) {
          this.setState({ cachedFlightsList: data });
        } else {
          console.log("sorry no flights found========");
        }

      })
      .catch((e) => console.log("flights data error=======", e));
    this.toggleLoading();
  }

  searchLiveFlights() {
    this.toggleLoading();
    getLiveFlights()
      .then((data) => {
        // console.log("data=========", data)
        if (data.list.length > 0) {
          let result = data.list;
          if (data.list.length > 10) {
            result = paginate(data.list);
            this.setState({
              currencySymbol: data.currency,
              paginated_data: result,
              filteredData: data.list,
              completeList: data.list,
              liveFlightsList: result[this.state.pageNumber] || []
            })
          } else {
            this.setState({
              currencySymbol: data.currency,
              paginated_data: [result],
              filteredData: data.list,
              completeList: data.list,
              liveFlightsList: result
            })
          }
          // console.log("result=========", result)
          // console.log("page number=========", this.state.pageNumber)
          
          // const currencySymbol = data.currency;
          
          let b = localStorage.getItem('bookingDetails')
          if (!!b) {
            let d = JSON.parse(b);
            this.setState({ booking: JSON.parse(b) });
            this.setState({ carriers: d.flight });
            this.state.carriers = d.flight;
            if (this.state.liveFlightsList.length > 10) {
              this.filterAndSort()
            }
          }
        } else {
          console.log("sorry no flights found========");
        }
        this.toggleLoading();
      })
      .catch((e) => {
        console.log("flights data error=======", e);
        this.toggleLoading();
      });
  }

  loadingMessage = () => {
    return (
      this.state.loading && (
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

  inputChangedHandler = (name) => (event) => {
    this.setState({ [name]: event.target.value });
  }

  handlePage(index) {
    this.setState({
      pageNumber: index,
      liveFlightsList: this.state.paginated_data[this.state.pageNumber] || []
    });
    // this.setState({});
  }

  nextPage = () => {
    let nextPage = this.state.pageNumber + 1
    if (nextPage > this.state.paginated_data.length - 1) {
      nextPage = 0
    }
    this.setState({
      pageNumber: nextPage,
      liveFlightsList: this.state.paginated_data[nextPage] || []
    })
  }

  prevPage = () => {
    let prevPage = this.state.pageNumber - 1
    if (prevPage < 0) {
      prevPage = this.state.paginated_data.length - 1
    }
    this.setState({
      pageNumber: prevPage,
      liveFlightsList: this.state.paginated_data[prevPage] || []
    })
  }

  sortSearchResultsBasedOnPrices = (event) => {
    setTimeout(() => {
      let price = this.state.price_sort;
      const newList = this.state.filteredData;
      if (price === "down") {
        this.setState({
          price_sort: "up",
          price_sort_text: "Price Low to High"
        });
        newList.sort((f, second) => (f.rate > second.rate ? 1 : -1));
      }
      if (price === "up") {
        this.setState({
          price_sort: "down",
          price_sort_text: "Price High to Low"
        });
        newList.sort((f, second) => (f.rate < second.rate ? 1 : -1));
      }
      const result = paginate(newList);
      // console.log(newList, result)

      this.setState({
        paginated_data: result,
        pageNumber: 0,
        liveFlightsList: result[0] || []
      });
    }, 100)
  }
  filterAndSort() {
    setTimeout(() => {
      let priceRange = this.state.price;
      let carriers = this.state.carriers;
      let maxStopage = this.state.maxStopage;
      let list = this.state.completeList || [];
      let alist = list.filter(r =>
        parseFloat(r.price) <= parseInt(priceRange[1])
        && parseFloat(r.price) >= parseInt(priceRange[0])
        && (r.carriers || '').toUpperCase().includes((carriers || '').toUpperCase())
        && (!!maxStopage ? r.number_of_stops <= maxStopage : true)
      )
      this.setState({ filteredData: alist });
      this.sortSearchResultsBasedOnPrices();
    }, 100)
  }

  handleSliderChange = (e, val) => {
    this.setState({ price: val });
    this.filterAndSort();
  }

  handleFilter = (e) => {
    this.state[e.target.name] = e.target.value;
    this.filterAndSort();
  }


  render() {
    const {
      destination, origin, departure_date, return_date
    } = this.state;
    let publicUrl = process.env.PUBLIC_URL + '/'
    let imagealt = 'image'
    let flight;
    let flightsPageNumbersListing;
    if (this.state.liveFlightsList.length == 0) {
      flight =
        <div className="tour-list-area">
          {this.state.cachedFlightsList.map((flightDetails) => {
            return <FlightOfflineItem key={flightDetails.id} {...flightDetails} />
          })}
        </div>
    } else {
      flight =
        <div className="tour-list-area">
          {this.state.liveFlightsList.map((flightDetails) => {
            // console.log("flightsDetails========", flightDetails)
            flightDetails.currencySymbol = this.state.currencySymbol
            if (flightDetails.cheapest != null) {
              return <LiveFlightItemCheapest key={flightDetails.id} {...flightDetails} />
            } else {
              return <LiveFlightItem key={flightDetails.id} {...flightDetails} />
            }

          })}
        </div>
      if (this.state.completeList.length>10) {
        flightsPageNumbersListing = 
          <div>
            {this.state.liveFlightsList.map((item, index) => {
              return (
                <li key={`item_${index}`}><a className={"page-numbers " + (this.state.pageNumber == index ? "current" : "")} onClick={() => this.handlePage(index)}>{index + 1}</a></li>
              )
            })}
          </div>
      } 
    }

    return <div className="tour-list-area pd-top-120 viaje-go-top">
      <div className="container">
        {this.loadingMessage()}
        <div className="row">
          <div className="col-xl-9 col-lg-8 order-lg-12">
            <div className="tp-tour-list-search-area">
              <div className="row">
                <div className="col-xl-4 col-sm-6">
                  <a className="btn btn-yellow" style={{ color: 'white' }}
                    onClick={this.sortSearchResultsBasedOnPrices}>
                    <i className={"la la-arrow-" + this.state.price_sort} />
                    {this.state.price_sort_text}
                  </a>
                </div>
              </div>
            </div>
            {flight}
            <div className="text-md-center text-left">
              <div className="tp-pagination text-md-center text-left d-inline-block mt-4">
                <ul>
                  <li><a className="prev page-numbers" onClick={this.prevPage}><i className="la la-long-arrow-left" /></a></li>
                  {flightsPageNumbersListing}
                  <li><a className="next page-numbers" onClick={this.nextPage}><i className="la la-long-arrow-right" /></a></li>
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
                        onChange={this.handleFilter} defaultValue={this.state.booking.flight} />
                      <span className="glyphicon glyphicon-ok form-control-feedback"></span>
                    </div>

                    <div className="form-group has-success has-feedback">
                      <label >Price Filter</label>
                      <Slider
                        getAriaLabel={(index) => (index === 0 ? 'Minimum price' : 'Maximum price')}
                        defaultValue={this.state.price}
                        name="price" onChange={this.handleSliderChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        // getAriaValueText={'valuetext'}
                        min={10}
                        max={12000}
                      />
                    </div>

                    <div className="form-group has-success has-feedback">
                      <label>Max Stoppage</label>
                      <input type="number" className="form-control" name="maxStopage" onChange={this.handleFilter} />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  }
}

export default TourListV2