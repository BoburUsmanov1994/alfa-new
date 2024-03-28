import React from 'react';
import styled from "styled-components";
import AgriculturalTypeContainer from "../containers/AgriculturalTypeContainer";


const Styled = styled.div`
`;
const AgriculturalTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <AgriculturalTypeContainer/>
        </Styled>
    );
};

export default AgriculturalTypePage;