import React from 'react';
import { MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import "./HomePage.css"
import logo_nest from "./img/nestjs.png"

function HomePage() {
  return (
    <div className="t_home row bd-highlight example-parent h-100">
        <div className="p-2 bd-highlight col-example col-md-7 h-100">
            <div className="d-flex flex-column align-items-center justify-content-evenly h-75">
                <label className="sign_label pt-md-5 mt-md-5">Sign in to transcendance</label>
                <img className="logo_nest" src={logo_nest} alt="Logo"  />
            </div>
        </div>
        <div className="col-md-1"></div>
        <div className="p-2 d-flex flex-column bd-highlight col-example col-md-4 justify-content-center h-50">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
                <label className="register_btn mb-3">If you dont have an account</label>
                <div className="d-flex flex-column align-items-center">
                    <MDBBtn outline>Register here</MDBBtn>
                </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75">
                <input type="email" placeholder="Email" class="form-control form_input shadow-sm mb-3 w-50" id="email" aria-describedby="email" />
                <input type="password" placeholder="Password" class="form-control form_input shadow-sm w-50" id="password" aria-describedby="email" />
                <a href="#" className="align-self-end w-50 ps-3 pt-2 recover_password">Recover password?</a>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pt-5">
                <MDBBtn size='lg' className="sign_in_button">Sign in</MDBBtn>
            </div>
            <div className="mt-5">
                <div className="line_or_login w-75">
                    <span>
                        Section Title
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
}

export default HomePage;