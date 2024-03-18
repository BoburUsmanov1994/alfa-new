import React from 'react';
import DistributionContainer from "../containers/DistributionContainer";
import styled from "styled-components";
import BcoTypeContainer from "../containers/BcoTypeContainer";

const Styled = styled.div`

`;
const BcoTypePage = ({
                         ...rest
                     }) => {
    return (
        <Styled {...rest}>
            <BcoTypeContainer/>
        </Styled>
    );
};

export default BcoTypePage;