import React from 'react';
import DistributionContainer from "../containers/DistributionContainer";
import styled from "styled-components";
import BcoTypeContainer from "../containers/BcoTypeContainer";
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