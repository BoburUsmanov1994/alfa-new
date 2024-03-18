import React from 'react';
import styled from "styled-components";
import ProductSubGroupContainer from "../containers/ProductSubGroupContainer";

const Styled = styled.div`
`;
const ProductSubGroupsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ProductSubGroupContainer />
        </Styled>
    );
};

export default ProductSubGroupsPage;