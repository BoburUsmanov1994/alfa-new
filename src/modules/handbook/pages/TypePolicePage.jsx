import React from 'react';
import styled from "styled-components";
import TypePoliceContainer from "../containers/TypePoliceContainer";


const Styled = styled.div`
`;
const TypePolicePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <TypePoliceContainer />
        </Styled>
    );
};

export default TypePolicePage;