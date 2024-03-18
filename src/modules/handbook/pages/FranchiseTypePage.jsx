import React from 'react';
import styled from "styled-components";
import FranchiseTypeContainer from "../containers/FranchiseTypeContainer";

const Styled = styled.div`
`;
const FranchiseTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <FranchiseTypeContainer />
        </Styled>
    );
};

export default FranchiseTypePage;