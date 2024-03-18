import React from 'react';
import styled from "styled-components";
import AgentViewContainer from "../containers/AgentViewContainer";


const Styled = styled.div`
  .box__outlined{
    border:1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .rodal-dialog {
    width: unset !important;
    max-width: 50%;
    min-width: 750px;
    min-height: 350px !important;
    max-height: 50vh !important;
    overflow-y: auto;
  }
`;
const AgentViewPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgentViewContainer />
        </Styled>
    );
};

export default AgentViewPage;