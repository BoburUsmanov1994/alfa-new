import React from 'react';
import styled from "styled-components";
import ProductViewContainer from "../containers/ProductViewContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
    .w-100{
      &>div{
        width: 100%;
      }
    }
`;
const ProductViewPage = ({...rest}) => {
    const {id = null} = useParams();
    return (
        <Styled {...rest}>
            <ProductViewContainer id={id}/>
        </Styled>
    );
};

export default ProductViewPage;