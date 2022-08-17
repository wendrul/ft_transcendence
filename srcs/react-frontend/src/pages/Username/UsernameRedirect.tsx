
import "./Username.css";
import { useAppSelector } from '../../_helpers/hooks';

import Username from './Username';

function UsernameRedirect(props: { component: any }) {

    const authentication = useAppSelector<any>(state => state.authentication);
    const userData = useAppSelector<any>(state => state.user);
    const needAlias = authentication.loggedIn && !userData.data?.login;
    const loading = authentication.initial || authentication.loggingIn;

    if(needAlias)
        return (
            <Username />
        )
    else if(loading)
        return (
            <>
            </>
        )
    else
        return (
            props.component
        )
}

export default UsernameRedirect;