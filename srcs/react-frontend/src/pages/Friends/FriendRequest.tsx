
import React, { useState, useEffect } from 'react';
import {
	MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '..//../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, friendActions, userActions } from '../../_actions';
import AlertPage from '../../components/Alerts/Alert';

import "./FriendRequest.css";

function FriendRequest() {
	const dispatch = useAppDispatch();
  const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const userData = useAppSelector<any>(state => state.user);
  const allUsers = useAppSelector<any>(state => state.users);

  const pendingRequests = useAppSelector<any>(state => state.friend);

  const [user, setUser] = useState({});
  
  interface ApiData {
    id:	number;
    firstName: string;
    lastName: string;
    email: string;
    login: string;
  }

  const [fRequest, settest] = useState<ApiData[]>([]);

	useEffect(() => {
		document.title = "Pending Requests";
	}, [])

  useEffect(() => {
		if (!authentication.loggedIn)
      navigate("/");
	}, [authentication])

  useEffect(() => {
    dispatch(friendActions.pendingRequests())
  }, [])

  useEffect(() => {
    if(pendingRequests.accept)
      window.location.reload();
  }, [pendingRequests.accept])

  useEffect(() => {
    let array: ApiData[] = [];
    for(let i = 0; i < pendingRequests.request.length; i++) {
      const user = allUsers.items.find((item:ApiData) => item.id === pendingRequests.request[i].senderId );
      array.push(user);
    }
    settest(array);
  }, [pendingRequests.request])


  async function acceptRequest(user: any, event:any ) {
    const req = pendingRequests.request.find((item:any) => item.senderId === user.id );
    let id = "" + req.id;
    dispatch(friendActions.acceptRequest(id, "accepted"))
  }

  async  function rejectedRequest(user: any, event:any ) {
    console.log("rejected")
    const req = pendingRequests.request.find((item:any) => item.senderId === user.id );
    let id = "" + req.id;
    dispatch(friendActions.acceptRequest(id, "rejected"))
  }

  return (
    <>
      {  authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <p className="register_btn mb-3">
                Friend Requiest
              </p>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">

              <MDBListGroup style={{ minWidth: '22rem' }}>
              { fRequest && fRequest.length === 0 &&
                <p className="register_btn mb-3">
                  empty
                </p>
              }
              { fRequest && fRequest.map((item:ApiData, i:number) =>
                
                <MDBListGroupItem key={i} className='d-flex justify-content-between align-items-center'>
                  <div className='d-flex align-items-center'>
                    <div className='ms-3'>
                      <p className='fw-bold mb-1'>{item?.login}</p>
                      <MDBBtn size='sm' href={"/profile/" + item?.login} rounded color='link'>
                        View Profile
                      </MDBBtn>
                    </div>
                  </div>
                  <div>
                    <MDBBtn onClick={(e) => {
                            acceptRequest(item, e);
                        }}size='sm'  rounded color='success'>
                      <MDBIcon icon="check" />
                    </MDBBtn>
                    <> </>
                    <MDBBtn onClick={(e) => {
                            rejectedRequest(item, e);
                        }}
                        size='sm' rounded color='danger'>
                      <MDBIcon icon="trash-alt" />
                    </MDBBtn>
                  </div>
                </MDBListGroupItem>
              )
            }
              </MDBListGroup>

            </div>
          </div>
        </div>
      }
    </>
  );
}

export default FriendRequest;