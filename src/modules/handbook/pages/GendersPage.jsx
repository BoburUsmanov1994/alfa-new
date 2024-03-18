import React from 'react';
import styled from "styled-components";
import GendersContainer from "../containers/GendersContainer";



const Styled = styled.div`
`;
const GendersPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <GendersContainer />
        </Styled>
    );
};

export default GendersPage;