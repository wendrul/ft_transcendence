import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
  MDBRadio,
  MDBRange,
	MDBInput,
  MDBCheckbox,
  MDBTabsPane
  } from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';

function RoomCreate(props: { active: boolean }) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
	const alert = useAppSelector<any>(state => state.alert);

  const [room, setRoom] = useState({
    name: '',
    password: '',
    score: "5",
    type: 'classic',
    ranking: 'lower',
    isprivate: false,
  });

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

	//	dispatch(userActions.signup(firstName, lastName, email, password));
	}

  const handleChangeNameRoom = function(event: ChangeEvent<HTMLInputElement>) {
    setRoom({...room,
      name: event?.currentTarget?.value
    });
  }

  const handleChangePasswordRoom = function(event: ChangeEvent<HTMLInputElement>) {
    setRoom({...room,
      password: event?.currentTarget?.value
    });
  }

  const handlePrivate = function(event: ChangeEvent<HTMLInputElement>) {
    setRoom({...room, isprivate: event?.currentTarget?.value == "true"? true: false })
  }

  return (
    <>
      <MDBTabsPane show={props.active}>
        <div className="d-flex flex-column align-items-center justify-content-center w-100 pb-5 mb-3">
          <form onSubmit={onSubmit}>
            <div className="register_btn mb-3">
              <p className="register_btn mb-3">
                type
              </p>
              <MDBRadio name='inlineRadio' id='inlineRadio1' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, ranking: "classic"})} label='Classic' defaultChecked inline
              />
              <MDBRadio name='inlineRadio' id='inlineRadio2' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, ranking: "power-up"})} label='Power-up' inline
              />
            </div>
            <div className="register_btn mb-3">
              <p className="register_btn mb-0">
                  Score
                </p>
              <MDBRange
                onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, score: event?.currentTarget?.value})}
                value={room.score}
                min='1'
                max='9'
                step='1'
                id='customRange3'
            
                labelClass='text-center w-100'
              />
            </div>
            <div className="register_btn mb-3">
              <p className="register_btn mb-3">
                Ranking
              </p>
              <MDBRadio name='rankingRadio' id='rankingRadio1' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, type: "lower"})} defaultChecked label='Lower' inline />
              <MDBRadio name='rankingRadio' id='rankingRadio2' onChange={(event: ChangeEvent<HTMLInputElement>) => setRoom({...room, type: "higher"})} label='Higher' inline />
            </div>
            <MDBInput className='mb-4 text-center' onChange={handleChangeNameRoom} type='text' label='Create Room Name' labelClass='text-center w-100' required />
            <MDBCheckbox name='flexCheck' value={ room.isprivate == false? "true":"false" } id='flexCheckDefault' onChange={handlePrivate} label='Private Room?' />
            {
              room.isprivate &&
              <MDBInput className='text-center' onChange={handleChangePasswordRoom} type='text' label='Password'labelClass='text-center w-100'required />
            }
            <MDBBtn type='submit' className='mt-4' block>
              create
            </MDBBtn>
          </form>
        </div>
      </MDBTabsPane>
    </>
  );
}

export default RoomCreate;