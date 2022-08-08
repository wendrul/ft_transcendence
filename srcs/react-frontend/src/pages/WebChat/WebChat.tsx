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
import "./WebChat.css";
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";

import { Sidenav, Nav } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'

function WebChat() {

  

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

  const [channels, setChannels] = useState([
    {
      type: "private",
      users: [{name:"corozco"}, {name:"ericc"}]
      // messages: ?? {}
    },
    {
      type: "private",
      users: [{name:"pppp"}, {name:"nando"}]
      // messages: ?? {}
    },
    {
      nameRoom: "Quimera",
      type: "public",
      Password: "",
      admin: "Corozco",
      mods: ["Ericc", "lorito"],
      userList: [ {name: "corozco"}, {name: "Ericc"}, {name: "lorito"}, {name:"pppp"}],
      usersBan: [{ name: "nando", time:"5"}, { name:"pppp", time:"10"}],
      // messages: ?? {}
    },
    {
      nameRoom: "Pajarito",
      type: 'protected',
      Password: "aaaa",
      admin: "Corozco",
      mods: ["Ericc", "lorito"],
      userList: [ {name: "corozco"}, {name: "Ericc"}, {name: "lorito"}, {name:"pppp"}],
      usersBan: [{ name: "nando", time:"5"}, { name:"pppp", time:"10"}],
      // messages: ?? {}
    },
    {
      nameRoom: "Rodrigos",
      type: "protected",
      Password: "eeee",
      admin: "Corozco",
      mods: ["Ericc", "lorito"],
      userList: [{ name: "corozco" }, { name: "Ericc" }, { name: "lorito" }, { name:"pppp" }],
      usersBan: [{ name: "nando", time:"5"}, { name:"pppp", time:"10" }],
      // messages: ?? {}
    },
    {
      nameRoom: "bgs",
      type: "public",
      Password: "",
      admin: "Corozco",
      mods: ["Ericc", "lorito"],
      userList: [{ name: "corozco" }, { name: "Ericc" }, { name: "lorito" }, { name:"pppp" }],
      usersBan: [{ name: "nando", time:"5"}, { name:"pppp", time:"10"}],
      // messages: ?? {}
    },
  ]);


  const [users, setUsers] = useState([
    {
      login: "Corozco",
      friend: true,
      connected: true
    },
    {
      login: "Ericc",
      friend: true,
      connected: true
    },
    {
      login: "nando",
      friend: false,
      connected: true
    },
    {
      login: "lorito",
      friend: true,
      connected: false
    },
    {
      login: "pppp",
      friend: false,
      connected: false
    },
  ]);

	useEffect(() => {
		document.title = "WebChat";
	}, [])

  return (
    <MDBCard className=""  >
      <MDBCardBody>
        <div className="row">
      		<div className="col">
              <div style={{ width: 200 }}>
                <Sidenav defaultOpenKeys={['1']}>
                  <Sidenav.Body>
                    <Nav activeKey="1">
                      <Nav.Menu eventKey="1" title="private" >
                        <Nav.Item eventKey="1-1">Ericc</Nav.Item>
                        <Nav.Item eventKey="1-2">nani</Nav.Item>
                        <Nav.Item eventKey="1-3">nano</Nav.Item>
                        <Nav.Item eventKey="1-4">nanu</Nav.Item>
                      </Nav.Menu>
                      <Nav.Menu eventKey="2" title="public">
                        <Nav.Item eventKey="2-1">Quimera</Nav.Item>
                        <Nav.Item eventKey="2-2">lobos</Nav.Item>
                        <Nav.Item eventKey="2-3">Personas</Nav.Item>
                      </Nav.Menu>
                      <Nav.Menu eventKey="3" title="protected">
                        <Nav.Item eventKey="3-1">noentrar</Nav.Item>
                        <Nav.Item eventKey="3-2">entrarpass</Nav.Item>
                        <Nav.Item eventKey="3-3">Versions</Nav.Item>
                      </Nav.Menu>
                    </Nav>
                  </Sidenav.Body>
                </Sidenav>
              </div>
            </div>

            <div className="col col-lg-2 pe3 ml-3">
            <div style={{ width: 200}}>
              <Sidenav defaultOpenKeys={['1']}>
                <Sidenav.Body>
                  <Nav activeKey="1">
                    <Nav.Menu eventKey="1" title="Friends" >
                      <Nav.Item eventKey="1-1">Ericc</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu eventKey="2" title="Users Connected">
                      <Nav.Item eventKey="2-1">Quimera</Nav.Item>
                      <Nav.Item eventKey="2-2">lobos</Nav.Item>
                      <Nav.Item eventKey="2-3">Personas</Nav.Item>
                    </Nav.Menu>
                    <Nav.Menu eventKey="3" title="User Disconnected">
                      <Nav.Item eventKey="3-1">noentrar</Nav.Item>
                      <Nav.Item eventKey="3-2">entrarpass</Nav.Item>
                      <Nav.Item eventKey="3-3">Versions</Nav.Item>
                    </Nav.Menu>
                  </Nav>
                </Sidenav.Body>
              </Sidenav>
            </div>

          </div>
        </div>
      </MDBCardBody>
    </MDBCard>
  );
}

export default WebChat;