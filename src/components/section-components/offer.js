import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class Offer extends Component {

    render() {

        let publicUrl = process.env.PUBLIC_URL+'/'

    return  <div className="offer-area pd-top-70 pd-bottom-70">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-xl-6 col-lg-8">
							<div className="section-title text-center">
								<h2 className="title">Why Use Flight Duck?</h2>
							</div>
						</div>
					</div>
				</div>

				<div className="container">
					<div className="row">
						<div className="col-md-4">
						<div className="single-intro wow animated fadeInUp" data-wow-duration="0.6s" data-wow-delay="0.1s">
							<h4 className="intro-title">
							<span className="intro-count">01</span>
							<Link className="intro-cat" to="/about">Travel</Link>
							</h4>
							<p>Sponsorships are like unicorns or leprechauns, talked about often but they don’t actually exist. There is only dollars and cents, the ...</p>
						</div>
						</div>
						<div className="col-md-4">
						<div className="single-intro wow animated fadeInUp" data-wow-duration="1.0s" data-wow-delay="0.2s">
							<h4 className="intro-title">
							<span className="intro-count">02</span>
							<Link className="intro-cat" to="/about">Experience</Link>
							</h4>
							<p>My response is usually harsh. Offended at the suggestion that a career that’s taken more than a decade to create could be...</p>
						</div>
						</div>
						<div className="col-md-4">
						<div className="single-intro wow animated fadeInUp" data-wow-duration="1.6s" data-wow-delay="0.3s">
							<h4 className="intro-title">
							<span className="intro-count">03</span>
							<Link className="intro-cat" to="/about">Relax</Link>
							</h4>
							<p>I have always made a living to make movies, never the other way around. When I first started I washed in a seafood restaurant....</p>
						</div>
						</div>
					</div>
				</div>
			</div>
        }
}

export default Offer