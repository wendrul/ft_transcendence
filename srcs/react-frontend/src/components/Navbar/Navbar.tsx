import React, { useEffect, useState } from 'react';
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
  MDBDropdownLink,
  MDBCollapse
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { userActions } from '../../_actions';

export default function NavbarComponent() {

  const dispatch = useAppDispatch();
  const authentication = useAppSelector<any>(state => state.authentication);

  const [showBasic, setShowBasic] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(userActions.whoami());
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
              <MDBNavbarLink href='#'>Webchat</MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='nav-link'>
                  Game
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <MDBDropdownLink>Leaderboard</MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink>Users connected</MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink href='/create_room'>Create Room</MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink>Quick game</MDBDropdownLink>
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>

          {/*
            <MDBNavbarItem>
              <MDBNavbarLink disabled href='#' tabIndex={-1} aria-disabled='true'>
                Disabled
              </MDBNavbarLink>
            </MDBNavbarItem>
           */}
          </MDBNavbarNav>
          <form className='d-flex input-group w-auto' onSubmit={onSerch}>
            <input type='search' className='form-control' placeholder='User ID' aria-label='Search' />
            <MDBBtn color='primary'>Search</MDBBtn>
          </form>
          {
            authentication.loggedIn &&
            <MDBNavbarNav className='d-flex input-group w-auto'>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag='a' className='nav-link'>
                  <MDBIcon icon="user" />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem>
                      <MDBDropdownLink href='/profile'>My Space</MDBDropdownLink>
                    </MDBDropdownItem>
                    <MDBDropdownItem>
                      <MDBDropdownLink onClick={logout} >Logout</MDBDropdownLink>
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
            </MDBNavbarNav>
          }
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}

export {NavbarComponent}