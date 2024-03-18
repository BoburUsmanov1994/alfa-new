import React from 'react';
import styled from "styled-components";
import AgreementViewContainer from "../containers/AgreementViewContainer";


const Styled = styled.div`
  .box__outlined{
    border:1px dotted #BABABA;
    padding: 15px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .rodal-dialog{
    min-height: 60vh !important;
  }
`;
const AgentViewPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgreementViewContainer />
        </Styled>
    );
};

export default AgentViewPage;