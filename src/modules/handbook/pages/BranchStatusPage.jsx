import React from 'react';
import styled from "styled-components";
import BranchStatusContainer from "../containers/BranchStatusContainer";



const Styled = styled.div`
`;
const BranchStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchStatusContainer />
        </Styled>
    );
};

export default BranchStatusPage;