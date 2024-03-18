import React from 'react';
import styled from "styled-components";
import BranchCreateContainer from "../containers/BranchCreateContainer";


const Styled = styled.div`
`;
const BranchCreatePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BranchCreateContainer/>
        </Styled>
    );
};

export default BranchCreatePage;