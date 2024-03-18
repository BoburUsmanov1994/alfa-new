import React from 'react';
import styled from "styled-components";
import TypeRiskContainer from "../containers/TypeRiskContainer";


const Styled = styled.div`
`;
const TypeRiskPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <TypeRiskContainer />
        </Styled>
    );
};

export default TypeRiskPage;