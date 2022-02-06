import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

const LiveFlightItem = (flightDetails) => {
  const openInNewTab = (url) => {
    console.log("WE IN THIS SHIT NOW")
    if (localStorage.getItem('only_flight') == 'true') {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    }
    
    else if (localStorage.getItem('only_hotel') == 'true') {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
      if (newWindow) newWindow.opener = null
    }
    
    // console.log("save flight urls=======", url);
    else if (localStorage.getItem('only_hotel') == 'false') {
      localStorage.setItem('flight_booking_url', url);
      window.location.href = `#booking-confirmation`
    }  
    console.log(flightDetails)
    localStorage.setItem('flight_details', JSON.stringify(flightDetails));
    console.log("create new page that only shows hotel and flight booking===")
    // window.location.href = `#destination-details`
  }

  return (
    <div className="single-destinations-list style-three">
      <div className="thumb">
        <img src={flightDetails.agent.image} alt={flightDetails.agent.name} style={{"objectFit": "scale-down"}} />
      </div>
      <div className="details" onClick={() => openInNewTab(flightDetails.booking_deep_link)}>
        <div className="row">
          <div className="col-sm-10 mt-3">
            <h3 className="title"><i className="fa fa-plane" />  {flightDetails.origin_station} - To - {flightDetails.destination_station}</h3>
            <p>Total Travel Time - {flightDetails.total_duration.hours} hours, {flightDetails.total_duration.minutes} minutes, </p>
          </div>
          <div className="col-sm-2 mt-4">
            <i className="fa fa-map-marker fa-4x" aria-hidden="true"></i>
          </div>
        </div>
        <p className="content">Depature Date - {flightDetails.departure.date} | Arrival Date - {flightDetails.arrival.date} </p>

        <div className="row">
          <div className="col-sm-6">
            <div className="list-price-meta">
              <div className="tp-list-meta d-inline-block">
                <p><i className="fa fa-clock-o" /> Departure Time - {flightDetails.departure.time}</p>
                <p><i className="fa fa-clock-o" /> Arrival Time - {flightDetails.arrival.time}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="list-price-meta">
              <div className="tp-list-meta d-inline-block">
                <h3>Total Price</h3>
                <h5><span>{flightDetails.currencySymbol}</span> {flightDetails.price}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveFlightItem