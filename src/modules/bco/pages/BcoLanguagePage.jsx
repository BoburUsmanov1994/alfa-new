import React from 'react';
import styled from "styled-components";
import BcoLanguageContainer from "../containers/BcoLanguageContainer";


const Styled = styled.div`
`;
const BcoLanguagePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BcoLanguageContainer/>
        </Styled>
    );
};

export default BcoLanguagePage;