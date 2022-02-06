import React, { Component, setState } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import { getCacheFlightHotelsPackage } from '../auth/helper/index';
import FlightHotelPackageItem from '../flights/flight_hotel_package_item';
import paginate from '../flights/paginate_flight_hotel_package';
import { Slider } from '@material-ui/core';

class HotelFlightPackageList extends Component {

  constructor() {
    super();
    this.state = {
      destination: "",
      origin: "",
      departure_date: "",
      return_date: "",
      departure_time_sort: "down",
      departure_time_sort_text: "Departure Time High to Low",
      price_sort: "down",
      price_sort_text: "Price High to Low",
      loading: false,
      hotelFlightPackageList: [],
      pageNumber: 0,
      paginated_data: [],
      priceRange: [10, 50000],
      starRating: '',
      hotelName: '',
      conpleteList: [],
      filteredData: [],
      accomodationType: ''
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
    this.searchCacheFlightHotelsPackage();
  }

  toggleLoading() {
    this.setState(state => ({
      loading: !state.loading
    }));
  }

  searchCacheFlightHotelsPackage() {
    this.toggleLoading();
    // const destination = localStorage.getItem("flight_destination");
    // const origin = localStorage.getItem("flight_origin");
    // const departure_date = localStorage.getItem("flight_departure_date");
    // const return_date = localStorage.getItem("flight_return_date");
    getCacheFlightHotelsPackage()
      .then((data) => {
        if (data.list.length > 0) {
          const result = paginate(data.list);
          this.setState({ paginated_data: result });
          this.setState({ conpleteList: data.list });
          this.setState({ filteredData: data.list });
          this.setState({ hotelFlightPackageList: result[this.state.pageNumber] });
        } else {
          console.log("sorry no packages found========");
        }
        this.toggleLoading();
      })
      .catch((e) => {
        console.log("packages data error=======", e);
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

  inputChangedHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSliderChange = (e, val) => {
    this.setState({ priceRange: val });
    this.filterAndSort();
  }
  handleFilter = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    this.filterAndSort()
  }
  sortSearchResultsBasedOnPrices = (event) => {
    setTimeout(() => {
      let price = this.state.price_sort;
      const newList = this.state.filteredData;
      if (price === "down") {
        this.setState({ price_sort: "up", price_sort_text: "Price Low to High" });
        newList.sort((first, second) => (first.deal_price > second.deal_price ? 1 : -1));
      }
      if (price === "up") {
        this.setState({ price_sort: "down", price_sort_text: "Price High to Low" });
        newList.sort((first, second) => (first.deal_price < second.deal_price ? 1 : -1));
      }
      this.setState({ filteredData: newList });
      const result = paginate(newList);
      this.setState({ paginated_data: result });
      this.setState({ pageNumber: 0 });
      this.setState({ hotelFlightPackageList: (result[0] || []) });
    }, 100)
  }

  sortSearchResultsBasedOnDepartureTime = (event) => {
    let departure_time = this.state.departure_time_sort;
    const newList = this.state.filteredData;

    if (departure_time === "down") {
      this.setState({
        departure_time_sort: "up",
        departure_time_sort_text: "Departure Date Low to High"
      });
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() > new Date(second.outbounddate).getTime() ? 1 : -1));
    } else {
      this.setState({
        departure_time_sort: "down",
        departure_time_sort_text: "Departure Date High to Low"
      });
      newList.sort((first, second) => (new Date(first.outbounddate).getTime() < new Date(second.outbounddate).getTime() ? 1 : -1));

    }
    this.setState({ filteredData: newList });
    const result = paginate(newList);
    this.setState({ paginated_data: result });
    this.setState({ pageNumber: 0 });
    this.setState({ hotelFlightPackageList: (result[0] || []) });
  }

  filterAndSort() {
    setTimeout(() => {
      let priceRange = this.state.priceRange;
      let star = this.state.starRating;
      let type = this.state.accomodationType;
      let name = this.state.hotelName;
      let list = this.state.conpleteList || [];
      let alist = list.filter(r =>
        parseFloat(r.deal_price) <= parseInt(priceRange[1])
        && parseFloat(r.deal_price) >= parseInt(priceRange[0])
        && (r.hotel_object.type || '').toUpperCase().includes(type)
        && (r.hotel_object.rating || '').toString().includes(`${star}`)
        && (r.hotel_object.hotel || '').toLowerCase().includes((name || '').toLocaleLowerCase())
      )
      this.setState({ filteredData: alist });
      const result = paginate(alist);
      this.setState({ paginated_data: result });
      this.setState({ pageNumber: 0 });
      this.setState({ hotelFlightPackageList: (result[0] || []) });
    }, 100)
  }
  handlePage(index) {
    this.setState({
      pageNumber: index,
      hotelFlightPackageList: this.state.paginated_data[this.state.pageNumber]
    });
  }

  nextPage = () => {
    let nextPage = this.state.pageNumber + 1
    if (nextPage > this.state.paginated_data.length - 1) {
      nextPage = 0
    }
    this.setState({
      pageNumber: nextPage,
      hotelFlightPackageList: this.state.paginated_data[nextPage]
    })
  }
  prevPage = () => {
    let prevPage = this.state.pageNumber - 1
    if (prevPage < 0) {
      prevPage = this.state.paginated_data.length - 1
    }
    this.setState({
      pageNumber: prevPage,
      hotelFlightPackageList: this.state.paginated_data[prevPage]
    })
  }

  render() {
    const {
      destination, origin, departure_date, return_date
    } = this.state;
    let publicUrl = process.env.PUBLIC_URL + '/'
    let imagealt = 'image'
    let flight;
    flight =
      <div className="tour-list-area">
        {this.state.hotelFlightPackageList.map((flightDetails) => {
          return <FlightHotelPackageItem key={flightDetails.outbounddate} {...flightDetails} />
        })};
      </div>

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
                <div className="col-xl-4 col-sm-6">
                  <a className="btn btn-yellow" style={{ color: 'white' }}
                    onClick={this.sortSearchResultsBasedOnDepartureTime}>
                    <i className="la la-arrow-down" />
                    {this.state.departure_time_sort_text}
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
            {flight}
            <div className="text-md-center text-left">
              <div className="tp-pagination text-md-center text-left d-inline-block mt-4">
                <ul>
                  <li><a className="prev page-numbers" onClick={this.prevPage}><i className="la la-long-arrow-left" /></a></li>
                  {this.state.paginated_data.map((item, index) => {
                    return (
                      <li key={`k1${index}`}><a className="page-numbers" onClick={() => this.handlePage(index)}>{index + 1}</a></li>
                    )
                  })}
                  <li><a className="next page-numbers" onClick={this.nextPage}><i className="la la-long-arrow-right" /></a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-4 order-lg-1">
            <div className="widget tour-list-widget">
              <div className="form-group has-success has-feedback">
                <label>Search Hotel Name</label>
                <input type="text" className="form-control" id="inputSuccess2" name="hotelName" onChange={this.handleFilter} />
                <span className="glyphicon glyphicon-ok form-control-feedback"></span>
              </div>
              <div className="form-group has-success has-feedback">
                <label ><i className="fa fa-star" /> Hotel Rating</label>
                <select className="form-control" name="starRating" onChange={this.handleFilter}>
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
                  defaultValue={this.state.priceRange}
                  name="priceRange" onChange={this.handleSliderChange}
                  valueLabelDisplay="auto"
                  aria-labelledby="range-slider"
                  // getAriaValueText={'valuetext'}
                  min={10}
                  max={100000}
                />
              </div>
              <div className="form-group has-success has-feedback">
                <label>Accomodation Type</label>
                <select className="form-control" name="accomodationType" onChange={this.handleFilter}>
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

  }
}

export default HotelFlightPackageList