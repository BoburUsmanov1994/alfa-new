import React from 'react';
import styled from "styled-components";
import TranslationsContainer from "../containers/TranslationsContainer";


const Styled = styled.div`
`;
const TranslationsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <TranslationsContainer />
        </Styled>
    );
};

export default TranslationsPage;