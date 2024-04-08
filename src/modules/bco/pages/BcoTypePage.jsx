import React from 'react';
import styled from "styled-components";
import BcoTypeContainer from "../containers/BcoTypeContainer";

const Styled = styled.div`
.rodal-dialog{
  width: 650px !important;
}
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