import React from 'react';
import styled from "styled-components";
import ProductGroupsContainer from "../containers/ProductGroupsContainer";

const Styled = styled.div`
`;
const ProductGroupsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ProductGroupsContainer />
        </Styled>
    );
};

export default ProductGroupsPage;