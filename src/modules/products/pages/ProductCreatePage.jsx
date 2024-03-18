import React from 'react';
import styled from "styled-components";
import ProductCreateContainer from "../containers/ProductCreateContainer";

const Styled = styled.div`
`;
const ProductCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ProductCreateContainer />
        </Styled>
    );
};

export default ProductCreatePage;