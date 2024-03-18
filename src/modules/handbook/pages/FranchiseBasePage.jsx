import React from 'react';
import styled from "styled-components";
import FranchiseBaseContainer from "../containers/FranchiseBaseContainer";

const Styled = styled.div`
`;
const FranchiseBasePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <FranchiseBaseContainer />
        </Styled>
    );
};

export default FranchiseBasePage;