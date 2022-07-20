import { useEffect } from 'react';
import {
  MDBBtn,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';

import "./HomePage.css";
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../_helpers/hooks';
function HomePage() {

  const [params, setSearchParams] = useSearchParams();
  params.get("__firebase_request_key")

	const authentication = useAppSelector<any>(state => state.authentication);

	useEffect(() => {
		document.title = "HomePage";
	
	}, [])

  return (
    <div className="p-5 row bd-highlight justify-content-center">
      <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100">

        <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
          <h1>
            ft_transcendence { params.get("code") }
          </h1>
        </div>
        { !authentication.loggedIn && 
          <div className="container px-4">
            <div className="row gx-5">
              <MDBCol>
                <MDBBtn type='submit' className='mb-4' href="/signin" block>
                  Sign in
                </MDBBtn>
              </MDBCol>
              <MDBCol>
                <MDBBtn type='submit' className='mb-4' href="/signup" block>
                  Sign Up
                </MDBBtn>
              </MDBCol>
            </div>
          </div>
        }
      </div>
    </div>
  );
}

export default HomePage;
