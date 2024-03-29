import React from 'react';
import styled from "styled-components";
import BcoContainer from "../containers/BcoContainer";

const Styled = styled.div`
.rodal-dialog{
  width: 800px !important;
}
`;
const BcoPage = ({
                         ...rest
                     }) => {
    return (
        <Styled {...rest}>
            <BcoContainer/>
        </Styled>
    );
};

export default BcoPage;