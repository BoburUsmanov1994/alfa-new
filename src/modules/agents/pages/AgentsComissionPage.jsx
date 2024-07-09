import React from 'react';
import styled from "styled-components";
import AgentsComissionContainer from "../containers/AgentsComissionContainer";

const Styled = styled.div`

`;
const AgentsCommissionPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentsComissionContainer />
        </Styled>
    );
};

export default AgentsCommissionPage;