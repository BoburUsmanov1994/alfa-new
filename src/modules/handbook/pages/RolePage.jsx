import React from 'react';
import styled from "styled-components";
import RoleContainer from "../containers/RoleContainer";


const Styled = styled.div`
`;
const RolePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <RoleContainer />
        </Styled>
    );
};

export default RolePage;