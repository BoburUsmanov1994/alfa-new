import React from 'react';
import styled from "styled-components";
import ProductsContainer from "../containers/ProductsContainer";

const Styled = styled.div`
`;
const ProductsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ProductsContainer />
        </Styled>
    );
};

export default ProductsPage;