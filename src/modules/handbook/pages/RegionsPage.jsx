import React from 'react';
import styled from "styled-components";
import RegionsContainer from "../containers/RegionsContainer";

const Styled = styled.div`
`;
const RegionsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <RegionsContainer/>
        </Styled>
    );
};

export default RegionsPage;