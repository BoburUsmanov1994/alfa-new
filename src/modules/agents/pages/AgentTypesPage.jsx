import React from 'react';
import styled from "styled-components";
import AgentTypesContainer from "../containers/AgentTypesContainer";

const Styled = styled.div`
`;
const AgentTypesPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentTypesContainer />
        </Styled>
    );
};

export default AgentTypesPage;