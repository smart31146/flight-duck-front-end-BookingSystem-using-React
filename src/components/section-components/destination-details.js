import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

let hotelDetails = null;
let roomDetails = null;
let roomName = null;
let flightDetails = null;
let onlyHotel = null;

class DestinatioDetails extends Component {

  componentWillMount() {
    onlyHotel = JSON.parse(localStorage.getItem("only_hotel"));
    console.log("onlyHotel=======", onlyHotel);
    hotelDetails = JSON.parse(localStorage.getItem("hotel_details"));
    console.log("let hotelDetails=======");
    console.log(hotelDetails)

    roomDetails = JSON.parse(localStorage.getItem("hotel_room_details"));
    roomName = localStorage.getItem("hotel_room_name");
    flightDetails = JSON.parse(localStorage.getItem("flight_details"));
  }

  render() {

    let publicUrl = process.env.PUBLIC_URL+'/'
    let imagealt = 'image'

    let flightDetailsTable;
    if (onlyHotel=='false') {
      flightDetailsTable = (
        <div style={{backgroundColor: 'white', margin: '20px', padding: '20px', borderRadius: '10px'}}>
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
                  <h4>{flightDetails['origin_station']}</h4>
                  <p>{flightDetails['departure']['time']}</p>
                </td>
                <td>
                  <h4>{flightDetails['destination_station']}</h4>
                  <p>{flightDetails['arrival']['time']}</p>
                </td>
                <td>
                  <h4>Layover</h4>
                  <p>{flightDetails['number_of_stops']}</p>
                </td>
                <td>
                  <h3><span>{flightDetails['currencySymbol']}</span>{flightDetails['price']}</h3>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    let paymentOption;
    if (onlyHotel == 'false') {
      paymentOption = (
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
      );
    }
    

    return	<div>
      <div className="destinations-details-page mt-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-10">
              <div className="destinations-details-main-slider-wrap">
                <div className="destinations-details-main-slider" style={{backgroundColor: '#efefef'}}>
                  <div className="d-details-main-slider-item" style={{padding: '18px'}}>
                    <center><img src={publicUrl+"assets/img/others/checkbox.png"} alt="img" style={{marginTop: '20px'}}/></center>
                    <center><h3>Congratulations</h3></center>
                    <center>
                      <p>
                        You have successfully selected the following hotel and flight for your journey. Please find the details below.
                      </p>
                      <br/>
                    </center>
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
                            <i className="fa fa-map-marker"></i> {hotelDetails['city']}
                            <h4 className="mt-2">{hotelDetails['hotel']}</h4>
                          </td>
                          <td>
                            <p>3 days 2 person</p>
                            <h4>{roomName}</h4>
                          </td>
                          <td>
                            <p>8 Oct to 10 Oct</p>
                            <h4>3 Days</h4>
                          </td>
                          <td>
                            <h3><span>$</span>{roomDetails['net']}</h3>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {flightDetailsTable}
                    <br/>
                    {paymentOption}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
  }
}

export default DestinatioDetails