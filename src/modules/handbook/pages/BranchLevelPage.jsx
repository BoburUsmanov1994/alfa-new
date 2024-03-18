import React from 'react';
import styled from "styled-components";
import BranchLevelContainer from "../containers/BranchLevelContainer";



const Styled = styled.div`
`;
const BranchLevelPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchLevelContainer />
        </Styled>
    );
};

export default BranchLevelPage;