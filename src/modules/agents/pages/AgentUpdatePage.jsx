import React from 'react';
import styled from "styled-components";
import AgentUpdateContainer from "../containers/AgentUpdateContainer";

const Styled = styled.div`
  .box__outlined{
    border:1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;
const AgentUpdatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentUpdateContainer />
        </Styled>
    );
};

export default AgentUpdatePage;