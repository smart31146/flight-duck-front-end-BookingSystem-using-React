import React, { Component, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import parse from 'html-react-parser';
import { red, blue, green } from "@material-ui/core/colors";
import { AutoRotatingCarousel, Slide } from "material-auto-rotating-carousel";
import defaultImage from './default.jpg';  // Import your default image

const FlightHotelPackageItem = (flightDetails) => {
  const [handleOpen, setHandleOpen] = useState({ open: false });
  const history = useHistory();

  const addDefaultSrc = ev => {
    ev.target.src = defaultImage;
  };

  const handleClick = () => {
    console.log("BELOW IS FLIGHT DETAILS")
    console.log(flightDetails)
    localStorage.setItem("packageDetails", JSON.stringify(flightDetails));
    history.push({
      pathname: "/tour-details",
      hotelDetails: { ...flightDetails.hotel_object, carrier_name: flightDetails.carrier_name, flightDetails: flightDetails }
    });
  };

  const imageUrl = (flightDetails.hotel_object && flightDetails.hotel_object.images && flightDetails.hotel_object.images.length > 0)
      ? flightDetails.hotel_object.images[0]
      : defaultImage;

  return (
      <div className="single-destinations-list style-three">
        <div className="thumb" onClick={handleClick}>
          <img
              src={imageUrl}
              onError={addDefaultSrc}
              alt="image"
              style={{ "objectFit": "scale-down" }}
          />
        </div>
      <div className="details">
        <div className="row">
          <div className="col-sm-10">
            <h4 className="title"><i className="fa fa-plane" />  {flightDetails.carrier_name}</h4>
            <h4 className="title"><i className="fa fa-bed" />  {flightDetails.hotel_object.hotel}</h4>
          </div>
          <div className="col-sm-2">
            <i className="fa fa-map-marker fa-3x" aria-hidden="true"></i>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="list-price-meta">
              <div className="tp-list-meta d-inline-block">
                <p><i className="fa fa-calendar-o" /> Departure Time - {flightDetails.outbounddate}</p>
                <p><i className="fa fa-calendar-o" /> Arrival Time - {flightDetails.inbounddate}</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="list-price-meta">
              <div className="tp-list-meta d-inline-block">
                <h3>Total Price</h3>
                <h5><span>$</span> {flightDetails.deal_price}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AutoRotatingCarousel
        label="Get started"
        open={handleOpen.open}
        onClose={() => setHandleOpen({ open: false })}
        onStart={() => setHandleOpen({ open: false })}
        autoplay={false}
        style={{ position: "absolute" }}
      >
        {flightDetails.hotel_object.images.map((image, i) => {
          return (<Slide key={`k${i}`}
            media={
              <img src={image} />
            }
            title={flightDetails.hotel}
          />);
        })}
      </AutoRotatingCarousel>
    </div>
    // <h1>{flightDetails.carrier_name}</h1>
  )
}

export default FlightHotelPackageItem