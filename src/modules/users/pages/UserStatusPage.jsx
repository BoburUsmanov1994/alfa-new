import React from 'react';
import styled from "styled-components";
import UserStatusContainer from "../containers/UserStatusContainer";


const Styled = styled.div`
`;
const UserStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <UserStatusContainer/>
        </Styled>
    );
};

export default UserStatusPage;