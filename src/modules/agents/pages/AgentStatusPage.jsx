import React from 'react';
import styled from "styled-components";
import AgentStatusContainer from "../containers/AgentStatusContainer";

const Styled = styled.div`
`;
const AgentStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentStatusContainer />
        </Styled>
    );
};

export default AgentStatusPage;