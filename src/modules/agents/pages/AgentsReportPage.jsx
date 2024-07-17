import React from 'react';
import styled from "styled-components";
import AgentsReportContainer from "../containers/AgentsReportContainer";

const Styled = styled.div`

`;
const AgentsReportPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentsReportContainer />
        </Styled>
    );
};

export default AgentsReportPage;