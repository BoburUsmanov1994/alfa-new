import React from 'react';
import styled from "styled-components";
import BranchesContainer from "../containers/BranchesContainer";

const Styled = styled.div`
`;
const BranchesPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchesContainer/>
        </Styled>
    );
};

export default BranchesPage;