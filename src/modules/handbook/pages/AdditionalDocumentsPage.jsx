import React from 'react';
import styled from "styled-components";
import AdditionalDocumentsContainer from "../containers/AdditionalDocumentsContainer";

const Styled = styled.div`
`;
const AdditionalDocumentsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AdditionalDocumentsContainer />
        </Styled>
    );
};

export default AdditionalDocumentsPage;