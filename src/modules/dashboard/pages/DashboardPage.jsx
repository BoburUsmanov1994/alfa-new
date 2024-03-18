import React from 'react';
import DashboardContainer from "../containers/DashboardContainer";


const DashboardPage = ({...rest}) => {
    return (
        <>
            <DashboardContainer {...rest} />
        </>
    );
};

export default DashboardPage;