import React from 'react';
import TerminationsContainer from "../containers/TerminationsContainer";

const TerminationsPage = ({...rest}) => {
    return (
        <div {...rest}>
            <TerminationsContainer/>
        </div>
    );
};

export default TerminationsPage;