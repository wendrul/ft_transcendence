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
  MDBCollapse,
  MDBSpinner
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../_helpers/hooks';
import { friendActions, userActions } from '../../_actions';

export default function NavbarComponent() {

  const dispatch = useAppDispatch();
  const authentication = useAppSelector<any>(state => state.authentication);
  const friend_req = useAppSelector<any>(state => state.friend);
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
  }, [dispatch])
  
  useEffect(()=> {
      if (authentication.loggedIn)
            dispatch(friendActions.pendingRequests())
  },[authentication.loggedIn, dispatch]) 

	const logout = () => {
    dispatch(userActions.signout());
	}

  useEffect(()=> {
    if (users.encontrado)
    {
      if (users.itemNavbar != null)
        navigate("/profile/" +users.itemNavbar.login)
    }
  },[users.itemNavbar]) 

  const onSerch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(userActions.getByLoginNavbar(userLogin));
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
        { !authentication.loggedIn && !authentication.loggingIn && !authentication.initial &&
          <>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
            </MDBNavbarNav>
            <MDBBtn disabled className='me-2'>
              <MDBSpinner size='sm' role='status' tag='span' />
              <span className='visually-hidden'>Loading...</span>
            </MDBBtn>
            <MDBBtn disabled>Connect..us</MDBBtn>
          </>
        }
        {  authentication.loggedIn &&
          <>
            <MDBNavbarNav className='mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink href='/web_chat'>Webchat</MDBNavbarLink>
              </MDBNavbarItem>

              <MDBNavbarItem>
                <MDBNavbarLink href='/Leaderboard'>Leaderboard</MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          
            
            <form className='d-flex input-group w-auto' onSubmit={onSerch}>
              <input type='search' className='form-control' onChange={handleChangeUserLogin} placeholder='User ID' aria-label='Search' />
              <MDBBtn color='primary'>Search</MDBBtn>
            </form>
            <MDBNavbarNav className='d-flex input-group w-auto'>
              <MDBNavbarItem>
                <MDBNavbarLink href='/friends'><MDBIcon color={ friend_req?.request.length > 0 ? "danger": "muted" } icon="bell" animate={ friend_req?.request.length > 0 ? "spin": "beat" }/></MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
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