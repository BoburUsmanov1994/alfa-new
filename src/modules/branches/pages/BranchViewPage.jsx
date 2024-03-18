import React from 'react';
import styled from "styled-components";
import BranchViewContainer from "../containers/BranchViewContainer";



const Styled = styled.div`
`;
const BranchViewPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchViewContainer/>
        </Styled>
    );
};

export default BranchViewPage;