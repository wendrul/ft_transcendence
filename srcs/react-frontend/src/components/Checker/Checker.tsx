import { useEffect } from 'react';
import { userActions } from '../../_actions';
import { useAppDispatch } from '../../_helpers/hooks';

function Checker() {
	const dispatch = useAppDispatch();

	useEffect(() => {
		setInterval(() => {
            dispatch(userActions.whoami);
        }, 500);
	}, [])

  return (
        <>
        <label>hola</label>
        </>
    )
}

export default Checker;
