import React from 'react';
import SignUpContainer from "../containers/SignUpContainer";

const SignUpPage = ({...rest}) => {
    return (
        <>
            <SignUpContainer {...rest} />
        </>
    );
};

export default SignUpPage;