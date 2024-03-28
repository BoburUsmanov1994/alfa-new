import React from 'react';
import styled from "styled-components";
import PropertyTypeContainer from "../containers/PropertyTypeContainer";


const Styled = styled.div`
`;
const PropertyTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PropertyTypeContainer/>
        </Styled>
    );
};

export default PropertyTypePage;