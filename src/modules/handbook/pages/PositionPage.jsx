import React from 'react';
import styled from "styled-components";
import PositionContainer from "../containers/PositionContainer";



const Styled = styled.div`
`;
const PositionPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PositionContainer />
        </Styled>
    );
};

export default PositionPage;