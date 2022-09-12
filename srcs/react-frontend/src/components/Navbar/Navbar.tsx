/* ******** */
/* 
  carga primero una pagina que no deberia, mirar esto en el redux, tal vez hay problema
*/
/* ******** */

import React, { useEffect, useState, ChangeEvent } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBBtn,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  // MDBDropdownLink,
  MDBCollapse
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { userActions } from '../../_actions';
import { user } from '../../_reducers/user.reducer';

export default function NavbarComponent() {

  const dispatch = useAppDispatch();
  const authentication = useAppSelector<any>(state => state.authentication);
  const users = useAppSelector<any>(state => state.users);

  const [showBasic, setShowBasic] = useState(false);
  let navigate = useNavigate();

  const [userLogin, setUserLogin] = useState("");

  useEffect(() => {
    dispatch(userActions.whoami());
    dispatch(userActions.getAll());
   /* let timerId = setInterval(() => {
      dispatch(userActions.whoami());
    }, 5000)
    return () => clearInterval(timerId);*/
  }, [])
  
	const logout = () => {
    dispatch(userActions.signout());
	}

  const onSerch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
    dispatch(userActions.getAll());
    const url = "/profile/" + userLogin;
    navigate(url)
	}

  const handleChangeUserLogin = function(event: ChangeEvent<HTMLInputElement>) {
    setUserLogin(event?.currentTarget?.value);
  }



  return (
    <MDBNavbar expand='lg' light bgColor='light'>
      <MDBContainer fluid>
        <MDBNavbarBrand href='/'>transcendence</MDBNavbarBrand>

        <MDBNavbarToggler
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon='bars' fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            {/*<MDBNavbarItem>
              <MDBNavbarLink active aria-current='page' href='#'>
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>*/}
            <MDBNavbarItem>
              <MDBNavbarLink href='/web_chat'>Webchat</MDBNavbarLink>
            </MDBNavbarItem>

         

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link'>
                  Game
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link href='/Leaderboard'>
                    {/* <MDBDropdownLink href='/Leaderboard'>Leaderboard</MDBDropdownLink> */}
                    Leaderboard
                  </MDBDropdownItem>
                  <MDBDropdownItem link>
                    {/* <MDBDropdownLink>Users connected</MDBDropdownLink> */}
                    Users connected
                  </MDBDropdownItem>
                  <MDBDropdownItem link href='/create_room'>
                    {/* <MDBDropdownLink href='/create_room'>Create Room</MDBDropdownLink> */}
                    Create Room
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    {/* <MDBDropdownLink>Quick game</MDBDropdownLink> */}
                    Quick game
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

               <MDBNavbarItem>
              <MDBNavbarLink href='/game-test'>Test</MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBNavbarLink href='/game-test2'>RoomTest</MDBNavbarLink>
            </MDBNavbarItem>

          {/*
            <MDBNavbarItem>
              <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                Disabled
              </MDBNavbarLink>
            </MDBNavbarItem>
           */
          }
          </MDBNavbarNav>
          {  authentication.loggedIn &&
            <>
              <form className='d-flex input-group w-auto' onSubmit={onSerch}>
                <input type='search' className='form-control' onChange={handleChangeUserLogin} placeholder='User ID' aria-label='Search' />
                <MDBBtn color='primary'>Search</MDBBtn>
              </form>
              <MDBNavbarNav className='d-flex input-group w-auto'>
                <MDBNavbarItem>
                  <MDBDropdown>
                    <MDBDropdownToggle tag='a' className='nav-link'>
                    <MDBIcon icon="user" />
                    </MDBDropdownToggle>
                    <MDBDropdownMenu>
                      <MDBDropdownItem link href='/profile'>
                        {/* <MDBDropdownLink href='/profile'>My Space</MDBDropdownLink> */}
                        My Space
                      </MDBDropdownItem>
                      <MDBDropdownItem link onClick={logout}>
                        {/* <MDBDropdownLink onClick={logout} >Logout</MDBDropdownLink> */}
                        Logout
                      </MDBDropdownItem>
                    </MDBDropdownMenu>
                  </MDBDropdown>
                </MDBNavbarItem>
              </MDBNavbarNav>
            </>
          }
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export {NavbarComponent}