import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
	MDBInput,
  MDBSwitch,
  MDBFile
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../../_actions';
import AlertPage from '../../../components/Alerts/Alert';
import axios from 'axios';
import { blob } from 'stream/consumers';
import config from '../../../config';

function EditPhoto() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);
	const alert = useAppSelector<any>(state => state.alert);

  const [user, setUser] = useState({});

	useEffect(() => {
		document.title = "Edit Photo";
		if(!authentication.loggedIn)
			navigate("/");
	}, [authentication])

  useEffect(() => {
		if(user && Object.keys(user).length === 0)
      setUser(userData.data);
	}, [authentication])

  const [selectedFile, setSelectedFile] = React.useState("");

  const handleFileSelect = (event: any) => {
    setSelectedFile(event.target.files[0])
  }

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    console.log(selectedFile);
    //dispatch(alertActions.clear());
    //dispatch(userActions.updateProfile(user));
    //navigate("/profile");

    const formData = new FormData();
    formData.append("file", selectedFile);


      console.log(formData)
      fetch( `${config.apiUrl}/users/avatar`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include'
        }
      ).then((response:any) => {
        console.log(response)
        if (response?.statusText === "Created")
         navigate("/profile");
      })

	}


  return (
    <>
      { authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <p className="register_btn mb-3">
                Change your Avatar.
              </p>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <form onSubmit={onSubmit}>
                <MDBFile className='mb-4' onChange={handleFileSelect} label='Avatar' />
                <br />
                <MDBBtn type='submit' className='mb-4' block>
                  Save
                </MDBBtn>
                {
                  alert && alert.message && alert.message?.map((value: any, key: number) => {
                    return <AlertPage key={key} type={alert.type} text={value} />
                  })
                }
              </form>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EditPhoto;
