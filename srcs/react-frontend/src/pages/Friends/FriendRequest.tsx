
import React, { useState, useEffect } from 'react';
import {
	MDBBtn,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBTabsContent,
  MDBTabsPane,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '..//../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { friendActions } from '../../_actions';
//import AlertPage from '../../components/Alerts/Alert';

import "./FriendRequest.css";
import config from '../../config';


function renderElement(Online:boolean, inGame:boolean){
  if(inGame === true)
     return <h3 className='text-warning'>In Game</h3>
  if (Online)
    return <h3 className='text-success'>Online</h3>
  return <h3 className='text-danger'>Offline</h3>
}


function FriendRequest() {
	const dispatch = useAppDispatch();
  const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
  const allUsers = useAppSelector<any>(state => state.users);

  const pendingRequests = useAppSelector<any>(state => state.friend);
 
  useEffect(() => {
		document.title = "Pending Requests";
	}, [])

  useEffect(() => {
		if (!authentication.loggedIn)
      navigate("/");
	}, [authentication, navigate])

  
  useEffect(() => {
    dispatch(friendActions.pendingRequests())
    dispatch(friendActions.getFriends())
  }, [dispatch])


  interface ApiData {
    id:	number;
    firstName: string;
    lastName: string;
    email: string;
    login: string;
  }

  const [fRequest, settest] = useState<ApiData[]>([]);

  useEffect(() => {
    let array: ApiData[] = [];
    for(let i = 0; i < pendingRequests.request.length; i++) {
      const user = allUsers.items.find((item:ApiData) => item.id === pendingRequests.request[i].senderId );
      array.push(user);
    }
    settest(array);
  }, [pendingRequests.request, allUsers.items])


  interface Friends {
    id:	number;
    firstName: string;
    lastName: string;
    login: string;
    online: boolean;
    inGame: boolean;
    gameRoom: string;
  }

  const [allfriends, setfriends] = useState<Friends[]>([]);

  useEffect(() => {
    let array: Friends[] = [];
    for(let i = 0; i < pendingRequests.friends.length; i++) {
      const user = pendingRequests.friends[i]
      array.push(user);
    }
    setfriends(array);
  }, [pendingRequests.friends, allUsers.items])


  useEffect(() => {
    if(pendingRequests.accept)
      window.location.reload();
  }, [pendingRequests.accept])

  

  async function acceptRequest(user: any, event:any ) {
    const req = pendingRequests.request.find((item:any) => item.senderId === user.id );
    let id = "" + req.id;
    dispatch(friendActions.acceptRequest(id, "accepted"))
  }

  async  function rejectedRequest(user: any, event:any ) {
    const req = pendingRequests.request.find((item:any) => item.senderId === user.id );
    let id = "" + req.id;
    dispatch(friendActions.acceptRequest(id, "rejected"))
  }

  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value: string) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  return (
    <>
      {  authentication.loggedIn && 
        <div className="p-5 bd-highlight justify-content-center d-flex">
          <div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
              <MDBTabs justify className='mb-3'>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
                    Friend Requiest
                  </MDBTabsLink>
                </MDBTabsItem>
                <MDBTabsItem>
                  <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
                    Friends
                  </MDBTabsLink>
                </MDBTabsItem>
              </MDBTabs>

              <MDBTabsContent>
                <MDBTabsPane show={justifyActive === 'tab1'}>
                  <MDBListGroup style={{ minWidth: '22rem' }}>
                    { fRequest && fRequest.length === 0 &&
                      <p className="register_btn mb-3">
                        empty
                      </p>
                    }
                    { fRequest && fRequest.map((item:ApiData, i:number) =>
                      <MDBListGroupItem key={i} className='d-flex justify-content-between align-items-center'>
                        <div className='d-flex align-items-center'>
                        <img
                            src={ `${config.apiUrl}/localFiles/` + item?.id }
                            alt=''
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                            />
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
                    )}
                  </MDBListGroup>
                </MDBTabsPane>

                <MDBTabsPane show={justifyActive === 'tab2'}>
                  <MDBListGroup style={{ minWidth: '22rem' }}>
                    { allfriends && allfriends.length === 0 &&
                      <p className="register_btn mb-3">
                        No tienes amigos
                      </p>
                    }
                    { allfriends && allfriends.map((item:Friends, i:number) =>
                      <MDBListGroupItem key={i} className='d-flex justify-content-between align-items-center'>
 
                        <div className='d-flex align-items-center'>
                        <img
                            src={ `${config.apiUrl}/localFiles/` + item?.id }
                            alt=''
                            style={{ width: '45px', height: '45px' }}
                            className='rounded-circle'
                            />
                          <div className='ms-3'>
                            <p className='fw-bold mb-1'>{item?.login}</p>
                            <MDBBtn size='sm' href={"/profile/" + item?.login} rounded color='link'>
                              View Profile
                            </MDBBtn>
                          </div>
                        </div>
                        <div>
                          <div className='ms-3'>
                            {renderElement(item?.online, item?.inGame )}
                          </div>
                        </div>
                        { item && item?.inGame && 
                          <div className='ms-3'>
                            <MDBBtn onClick={() =>  window.location.href=window.location.origin + '/play-premade/' + item?.gameRoom }size='sm'  rounded color='success'>
                            Spectate
                           </MDBBtn>
                          </div>
                        }
                      </MDBListGroupItem>
                    )}
                  </MDBListGroup>
                </MDBTabsPane>
              </MDBTabsContent>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default FriendRequest;
