import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { isAuthenticated, signout } from "../auth/helper/index";
import { setGlobalState, useGlobalState } from '../../index';



const Navbar = () => {

        let publicUrl = process.env.PUBLIC_URL+'/'
        let imgattr = 'logo'
		let anchor = '#'


		/*	const selected = useGlobalState.currencyOptions[0].value;*/

	const [currencyOptions] = useGlobalState("currencyOptions")
	console.log("CURRENCYOPTIONS")
	console.log(currencyOptions)

	const [selected] = useGlobalState("selectedCurrency")
	console.log("SELECTED CURRENCY")
	console.log(selected)


/*		const [selected, setSelected] = [currencyOptions[0]]*/

/*		const setSelected = setGlobalState(currencyOptions[0].value);*/

		const currencyHandleChange = (e) => {
			console.log("CAT");
			console.log(selected);
			setGlobalState("selectedCurrency", (e.target.value))
		};

        return (
			<nav className="navbar navbar-area navbar-expand-lg nav-style-01 viaje-go-top navbar-area">
			  <div className="container nav-container">
			    <div className="responsive-mobile-menu">
			      <div className="mobile-logo">
			        <Link to="/">
			          {/* <img src={publicUrl+"assets/img/sticky-logo.png"} alt={ imgattr } /> */}
			          <img src={publicUrl+"assets/img/others/small-logo.png"} alt={ imgattr } />
			        </Link>
			      </div>
			      <button className="navbar-toggler float-right" type="button" data-toggle="collapse" data-target="#tp_main_menu" aria-expanded="false" aria-label="Toggle navigation">
			        <span className="navbar-toggle-icon">
			          <span className="line" />
			          <span className="line" />
			          <span className="line" />
			        </span>
			      </button>
			      <div className="nav-right-content">
			        <ul className="pl-0">
			          <li className="top-bar-btn-booking">
			            <Link className="btn btn-yellow" to="/tour-details">Book Now <i className="fa fa-paper-plane" /></Link>
			          </li>
			          <li className="tp-lang">
			            <div className="tp-lang-wrap">
			              <select className="select single-select">
			                <option value={1}>ENG</option>
			                <option value={2}>BAN</option>
			                <option value={3}>Chinese</option>
			                <option value={3}>Spanish</option>
			              </select>
			            </div>
			          </li>
			          <li className="search">
			            <i className="ti-search" />
			          </li>
			          <li className="notification">
			            <a className="signUp-btn" href="#">
			              <i className="fa fa-user-o" />
			            </a>
			          </li>
			        </ul>
			      </div>
					</div>

			    <div className="collapse navbar-collapse" id="tp_main_menu">
			      <div className="logo-wrapper desktop-logo">
			        <Link to="/" className="main-logo">
						<img src={publicUrl+"assets/img/others/small-logo.png"} alt={ imgattr } />
					</Link>
			        <Link to="/" className="sticky-logo">
						<img src={publicUrl+"assets/img/others/small-logo.png"} alt={ imgattr } />
					</Link>
			      </div>
			      <ul className="navbar-nav">
			        <li className="menu-item-has-children">
			          <Link to="/">Home</Link>
			          <ul className="sub-menu">
			            <li><Link to="/">Home 01</Link></li>
			            <li><Link to="/home-v2">Home 02</Link></li>
			            <li><Link to="/home-v3">Home 03</Link></li>
			          </ul>
			        </li>
			        <li>
			          <Link to="/about">About Us</Link>
			        </li>
			        <li className="menu-item-has-children">
			          <a href="#">Pages</a>
			          <ul className="sub-menu">
			            <li><Link to="/tour-list">Tours List</Link></li>
			            <li><Link to="/tour-list-v2">Tours List 02</Link></li>
			            <li><Link to="/tour-list-v3">Tours List 03</Link></li>
			            <li><Link to="/tour-details">Tours Details</Link></li>
			            <li><Link to="/destination-list">Destination List</Link></li>
			            <li><Link to="/destination-list-v2">Destination List 2</Link></li>
			            <li><Link to="/destination-details">Destination Details</Link></li>
			            <li><Link to="/gallery">Gallery</Link></li>
			            <li><Link to="/gallery-details">Gallery Details</Link></li>
			            <li><Link to="/comming-soon">Comming soon</Link></li>
			            <li><Link to="/error">404</Link></li>
			            <li><Link to="/faq">FAQ</Link></li>
			            <li><Link to="/user-profile">User Profile</Link></li>
			          </ul>
			        </li>
			        <li className="menu-item-has-children">
			          <Link to="/blog">Blog</Link>
			          <ul className="sub-menu">
			            <li><Link to="/blog">Blog</Link></li>
			            <li><Link to="/blog-v2">Blog 02</Link></li>
			            <li><Link to="/blog-v3">Blog 03</Link></li>
			            <li><Link to="/blog-details">Blog Details</Link></li>
			          </ul>
			        </li>
			        <li>
			          <Link to="/contact">Contact</Link>
			        </li>
			      </ul>
					</div>
					<div className="tp-currency-wrap" >
{/*						<select className="select single-select" onChange={currencyHandleChange}>*/}
						<select className="cat" value={selected} onChange={currencyHandleChange}>
							{currencyOptions.map(option => (
								<option key={option.value} value={option.value}>
									{option.value}
								</option>
							))}
						</select>

{/*							<option value="AUD">Option #1</option>
							<option value="USD">Option #3</option>
							<option value="NZD">Option #41</option>*/}
{/*							<option value="NZD" >NZD</option>
							<option value="USD" >USD</option>
							<option value="GBP">GBP</option>
							<option value="EUR">EUR</option>
							<option value="CAN">CAN</option>
							<option value="EUR">EUR</option>
							<option value="JPY">JPY</option>
							<option value="INR ">INR </option>*/}
{/*						</select>*/}
					</div>
					<div className="nav-right-content">


			      <ul>
				  	{isAuthenticated () && (
						<li>
							<span
								onClick={() => {
									signout(() => {
									// history.push("/");
										// <Redirect to="/user-profile" />;
										// <Link className="btn btn-yellow" to="/">Sign Out</Link>
									});
								}}
								className="nav-link text-warning"
								>
								<Link className="btn btn-yellow" to="/">Sign Out</Link>
							</span>
						</li>
					)}
					{!isAuthenticated() && (
						<li>
							<Link className="btn btn-yellow" to="/signin">Sign In</Link>
						</li>  
					)}
			      </ul>
			    </div>
			  </div>
			</nav>
        )
}


export default Navbar