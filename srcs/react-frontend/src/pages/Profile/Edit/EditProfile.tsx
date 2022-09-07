/************************************/
/*
  -Problema, al estar actualizando,
  si hay error (login in use) u otro,
  te dirige directamente a la paguna
  username (MIRAR ESTO)


  -Avatar aun no conectado
*/
/************************************/
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput,
  MDBSwitch,
  MDBFile,
  MDBListGroup,
  MDBListGroupItem,
  MDBDropdownLink,
  MDBDropdownItem
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../../_actions';
import AlertPage from '../../../components/Alerts/Alert';

function EditProfile() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);

  const [user, setUser] = useState({});


	useEffect(() => {
		document.title = "Edit Profile";
	}, [])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])


  return (
    <>
      { authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
             <p className="register_btn mb-3">
               Edit your
              </p>
              <MDBListGroup style={{ minWidth: '22rem' }}>
                <MDBListGroupItem tag='a' href='/edit_info' action className='px-3'>
                  info
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='/edit_photo' action className='px-3'>
                  photo
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='/edit_2fa' action className='px-3'>
                  2fa
                </MDBListGroupItem>
              </MDBListGroup>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EditProfile;