import React from 'react';
import AccountContainer from "../containers/AccountContainer";
import styled from "styled-components";

const Styled = styled.div`
`;
const AccountPage = ({
                         ...rest
                     }) => {
    return (
        <Styled {...rest}>
            <AccountContainer/>
        </Styled>
    );
};

export default AccountPage;