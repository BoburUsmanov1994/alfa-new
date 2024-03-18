import React from 'react';
import styled from "styled-components";
import ManagerDocumentTypeContainer from "../containers/ManagerDocumentTypeContainer";



const Styled = styled.div`
`;
const ManagerDocumentTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ManagerDocumentTypeContainer />
        </Styled>
    );
};

export default ManagerDocumentTypePage;