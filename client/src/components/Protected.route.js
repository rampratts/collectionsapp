import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import auth from '../auth';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        auth.isAuthenticated()
           .then(() => setIsLoaded(true))
           .catch(e => console.log(e));
    }, []);

    if(!isLoaded){
        return (<React.Fragment/>)
    }else {
        return (
            <Route 
                {...rest}
                render={props => {
                    if(auth.authenticated){
                        return <Component {...props} />
                    } else {
                        props.history.push("/login");
                    }
                }}
            />
        )
    }
}