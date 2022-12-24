import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase';
import AuthUserContext from './context';

const withAuthentication = Component => {
    const WithAuthentication = ({ firebase, ...props }) => {
        const [authUser, setAuthUser] = useState(null);

        // like componentDidMount()
        useEffect(() => {
            const listener = firebase.auth.onAuthStateChanged(authUser => {
                authUser ? setAuthUser(authUser) : setAuthUser(null)
            })

            // like componentWillUnmount()
            return () => {
                listener();
            }
        }, [firebase.auth])

        return (
        	<AuthUserContext.Provider value={authUser}>
        		<Component {...props} />
        	</AuthUserContext.Provider>
        )
    }

    return withFirebase(WithAuthentication);
}

export default withAuthentication;