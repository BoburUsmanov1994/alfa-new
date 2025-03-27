import React from 'react';
import styled from "styled-components";
import NbuContainer from "../containers/NbuContainer";

const Styled = styled.div`
  .rodal-dialog{
    min-height: 60vh !important;
  }
`;
const NbuPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <NbuContainer/>
        </Styled>
    );
};

export default NbuPage;
