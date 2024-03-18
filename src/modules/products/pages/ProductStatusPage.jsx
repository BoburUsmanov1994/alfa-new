import React from 'react';
import styled from "styled-components";
import ProductStatusContainer from "../containers/ProductStatusContainer";

const Styled = styled.div`
`;
const ProductStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ProductStatusContainer />
        </Styled>
    );
};

export default ProductStatusPage;