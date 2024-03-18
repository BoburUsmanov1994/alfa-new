import React from 'react';
import styled from "styled-components";
import TypeObjectContainer from "../containers/TypeObjectContainer";

const Styled = styled.div`
`;
const TypeObjectPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <TypeObjectContainer />
        </Styled>
    );
};

export default TypeObjectPage;