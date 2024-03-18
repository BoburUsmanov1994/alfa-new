import React from 'react';
import styled from "styled-components";
import PersonTypeContainer from "../containers/PersonTypeContainer";

const Styled = styled.div`
`;
const PersonTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <PersonTypeContainer />
        </Styled>
    );
};

export default PersonTypePage;