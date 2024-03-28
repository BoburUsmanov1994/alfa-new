import React from 'react';
import styled from "styled-components";
import PropertyRightTypeContainer from "../containers/PropertyRightTypeContainer";


const Styled = styled.div`
`;
const PropertyRightTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PropertyRightTypeContainer/>
        </Styled>
    );
};

export default PropertyRightTypePage;