import React, { useState, useEffect, ChangeEvent } from 'react';
import {
	MDBBtn,
	MDBInput,
	MDBSwitch
} from 'mdb-react-ui-kit';
import { useAppDispatch, useAppSelector } from '../../../_helpers/hooks';
import { useNavigate } from 'react-router-dom';
import { alertActions, userActions } from '../../../_actions';
import AlertPage from '../../../components/Alerts/Alert';
import config from '../../../config';

function Edit2fa() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authentication = useAppSelector<any>(state => state.authentication);
	const userData = useAppSelector<any>(state => state.user);
	const alert = useAppSelector<any>(state => state.alert);

	const [user, setUser] = useState({});
	const [boolTwo, SetBoolTwo] = useState(userData.data.twoFactorAuthenticationFlag);
	const toggleSwitch = () => SetBoolTwo((previousState:boolean) => !previousState);
	/* qr */
	let ima_qr = undefined;
	ima_qr = `${config.apiUrl}/2fa/generate`
	const [code, setCode] = useState("");


	useEffect(() => {
		document.title = "Edit 2fa";
		if(!authentication.loggedIn)
			navigate("/");
	}, [authentication])

	useEffect(() => {
		if(user && Object.keys(user).length === 0)
			setUser(userData.data);
	}, [authentication])

	useEffect(() => {
		dispatch(alertActions.clear());
	}, [])

	useEffect(() => {
		if (userData && userData.validated)
			navigate("/")
	}, [userData])

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		dispatch(userActions.turnOn2fa(code));
	}

	const handletest = function(event: ChangeEvent<HTMLInputElement>) {
		toggleSwitch()
		setUser({...user, twoFactorAuthenticationFlag: !boolTwo});
		dispatch(userActions.turnOff2fa());
	}

	const handleChangeCode = function(event: ChangeEvent<HTMLInputElement>) {
		setCode(event?.currentTarget?.value);
	}


	return (
		<>
			{ authentication.loggedIn && 
			<div className="p-5 bd-highlight justify-content-center d-flex">
				<div className="p-2 d-flex flex-column bd-highlight col-example col-md-6 align-items-center justify-content-center h-100 w-100">
					<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
						<p className="register_btn mb-3">
							edit 2fa
						</p>
						{ !boolTwo &&
						<>
							<img className='qr' src={ ima_qr } alt='qr'></img>
							<br/>
							<p className="register_btn mb-3">
								Enter your code.
							</p>
							<form onSubmit={onSubmit}>
								<MDBInput className='mb-4' onChange={handleChangeCode} type='text' id='form3Example3' required />
								<MDBBtn type='submit' className='mb-4' block>
									Summit
								</MDBBtn>
							</form>
							{ alert && <AlertPage type={alert.type} text={alert.message} /> }
						</>
						}
					</div>
					<div className="d-flex flex-column align-items-center justify-content-center w-75 pb-5 mb-3">
						{ boolTwo &&
						<form onSubmit={onSubmit}>
							<div>
								<MDBSwitch checked={boolTwo} label='Two Factor Authentication' onChange={handletest} />
							</div>
						</form>
						}
						{
							/*   alert && alert.message && alert.message?.map((value: any, key: number) => {
										return <AlertPage key={key} type={alert.type} text={value} />
									})
							 */
						}
					</div>
				</div>
			</div>
			}
		</>
	);
}

export default Edit2fa;
