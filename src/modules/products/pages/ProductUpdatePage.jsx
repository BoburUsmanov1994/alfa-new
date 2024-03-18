import React from 'react';
import styled from "styled-components";
import ProductViewContainer from "../containers/ProductViewContainer";
import {useParams} from "react-router-dom";
import ProductupdateContainer from "../containers/ProductUpdateContainer";

const Styled = styled.div`

`;
const ProductUpdatePage = ({...rest}) => {
    const {id = null} = useParams();
    return (
        <Styled {...rest}>
            <ProductupdateContainer id={id}/>
        </Styled>
    );
};

export default ProductUpdatePage;