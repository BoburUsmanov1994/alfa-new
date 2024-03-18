import React from 'react';
import styled from "styled-components";
import BcoBlankContainer from "../containers/BcoBlankContainer";

const Styled = styled.div`

`;
const BcoBlankPage = ({
                         ...rest
                     }) => {
    return (
        <Styled {...rest}>
            <BcoBlankContainer/>
        </Styled>
    );
};

export default BcoBlankPage;