import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBRow,
	MDBCol,
  MDBRadio,
  MDBRange,
	MDBInput,
  MDBCheckbox,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBListGroupItem,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText
  } from 'mdb-react-ui-kit';
import "./Room.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";

function Room() {

  

  // Get ID from URL
  const { uuid } = useParams();

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
	const alert = useAppSelector<any>(state => state.alert);
  const [room, setRoom] = useState({
    name: "E6CS4F",
    owner: "corozco",
    type: "Classic",
    password: "3fCs",
    private: false,
    score: "9"
  })

	useEffect(() => {
		document.title = "Room";
	}, [])

  return (

    <MDBCard className="m-5">
      <MDBCardBody>
        <div className="col-xs-12 col-md-4">
          <MDBListGroupItem tag='a' action color='dark'>
            <b>Name: </b> {room.name}
          </MDBListGroupItem>
          <MDBListGroupItem tag='a' action color='light'>
          <b>Owner: </b> {room.owner}
          </MDBListGroupItem>
          <MDBListGroupItem tag='a' action color='dark'>
            <b>Privacy: </b> {room.private ? "Private" : "Public"}
          </MDBListGroupItem>
          <MDBListGroupItem tag='a' action color='light'>
          <b>Password: </b> { room.private ? room.password : "No password"}
          </MDBListGroupItem>
          <MDBListGroupItem tag='a' action color='dark'>
            <b>Score: </b> {room.score}
          </MDBListGroupItem>
        </div>
        <div className="col-xs-12 col-md-4">
          <div className="w-100">nani</div>
        </div>
      </MDBCardBody>
    </MDBCard>

    
  );
}

export default Room;