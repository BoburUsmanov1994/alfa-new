import React from 'react';
import styled from "styled-components";
import DocumentTypeContainer from "../containers/DocumentTypeContainer";


const Styled = styled.div`
`;
const DocumentTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <DocumentTypeContainer/>
        </Styled>
    );
};

export default DocumentTypePage;