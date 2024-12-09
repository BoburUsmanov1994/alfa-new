import React from 'react';
import PolicyTerminationContainer from "../containers/PolicyTerminationContainer";
import {useParams} from "react-router-dom";

const PolicyTerminationPage = () => {
    const {id,policyId} = useParams();
    return (
        <>
            <PolicyTerminationContainer id={id} policyId={policyId} />
        </>
    );
};

export default PolicyTerminationPage;