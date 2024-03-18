import React from 'react';
import styled from "styled-components";
import ProductsContainer from "../containers/ProductsContainer";
import AgreementsContainer from "../containers/AgreementsContainer";

const Styled = styled.div`
`;
const AgreementsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgreementsContainer/>
        </Styled>
    );
};

export default AgreementsPage;