import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

let hotelDetails = null;
let roomDetails = null;
let roomName = null;
let flightDetails = null;

class BookingConfirmation extends Component {

  componentWillMount() {
    hotelDetails = JSON.parse(localStorage.getItem("hotel_details"));
    console.log("this is hotelDetails HERE ", hotelDetails)
    console.log("let hotelDetails=======");
    console.log(hotelDetails)
    // console.log("hotel name=====", hotelDetails['hotel'])
    roomDetails = JSON.parse(localStorage.getItem("hotel_room_details"));
    roomName = localStorage.getItem("hotel_room_name");
    flightDetails = JSON.parse(localStorage.getItem("flight_details"));
  }

  render() {

    let publicUrl = process.env.PUBLIC_URL+'/'
    let imagealt = 'image'

    return	<div>
      <div className="destinations-details-page mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <center>
                <b>Hotel Details - </b>
              </center>
              <table className="table">
                <tbody>
                  <tr>
                    <td className="title">City</td>
                    <td className="title">Room</td>
                    <td className="title">Duration</td>
                    <td className="title">Price</td>
                  </tr>
                  <tr>
                    <td>
                      {/* <i className="fa fa-map-marker"></i> Maldives */}
                      <i className="fa fa-map-marker"></i> {hotelDetails['city']}
                      {/* <h4 className="mt-2">Spanish Steps</h4> */}
                      <h4 className="mt-2">{hotelDetails['hotel']}</h4>
                    </td>
                    <td>
                      <p>3 days 2 person</p>
                      {/* <h4>Studio Queen</h4> */}
                      <h4>{roomName}</h4>
                    </td>
                    <td>
                      <p>8 Oct to 10 Oct</p>
                      <h4>3 Days</h4>
                    </td>
                    <td>
                      {/* <h3><span>$</span>320</h3> */}
                      <h3><span>$</span>{roomDetails['net']}</h3>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br/>
              <div style={{backgroundColor: 'white'}}>
                <center>
                  <b>Flight Details - </b>
                </center>
                <br></br>
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="title">From</td>
                      <td className="title">To</td>
                      <td className="title">Flight Type</td>
                      <td className="title">Price</td>
                    </tr>
                    <tr>
                      <td>
                        {/* <h4>New York(JKF)</h4> */}
                        <h4>{flightDetails['origin_station']}</h4>
                        {/* <p>17:30</p> */}
                        <p>{flightDetails['departure']['time']}</p>
                      </td>
                      <td>
                        {/* <h4>Tel Aviv(TLV)</h4> */}
                        <h4>{flightDetails['destination_station']}</h4>
                        <p>{flightDetails['arrival']['time']}</p>
                      </td>
                      <td>
                        <h4>Layover</h4>
                        {/* <p>(2 hours and 15 minutes) Moscow</p> */}
                        <p>{flightDetails['number_of_stops']}</p>
                      </td>
                      <td>
                        {/* <h3><span>$</span>320</h3> */}
                        <h3><span>{flightDetails['currencySymbol']}</span>{flightDetails['price']}</h3>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <br/>
              <center>
                <Link
                  className="btn btn-aqua"
                  to={{
                    pathname: "/hotel-booking",
                    state: {
                      hotelDetails: hotelDetails,
                      room: roomDetails,
                      roomName: roomName,
                      carrier_name: hotelDetails.carrier_name
                    }
                  }}
                >
                  Pay Now
                </Link>
              </center>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  }
}

export default BookingConfirmation