import React from 'react';
import styled from "styled-components";
import BranchUpdateContainer from "../containers/BranchUpdateContainer";


const Styled = styled.div`
`;
const BranchUpdatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchUpdateContainer/>
        </Styled>
    );
};

export default BranchUpdatePage;