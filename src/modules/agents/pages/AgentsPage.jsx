import React from 'react';
import styled from "styled-components";
import AgentsContainer from "../containers/AgentsContainer";

const Styled = styled.div`
    .rodal-dialog{
      width: 800px !important;
    }
`;
const AgentsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentsContainer />
        </Styled>
    );
};

export default AgentsPage;