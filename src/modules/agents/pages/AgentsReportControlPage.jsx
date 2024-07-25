import React from 'react';
import styled from "styled-components";
import AgentsReportControlContainer from "../containers/AgentsReportControlContainer";

const Styled = styled.div`

`;
const AgentsReportControlPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentsReportControlContainer/>
        </Styled>
    );
};

export default AgentsReportControlPage;