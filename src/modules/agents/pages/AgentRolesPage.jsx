import React from 'react';
import styled from "styled-components";
import AgentRolesContainer from "../containers/AgentRolesContainer";

const Styled = styled.div`
`;
const AgentRolesPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentRolesContainer />
        </Styled>
    );
};

export default AgentRolesPage;