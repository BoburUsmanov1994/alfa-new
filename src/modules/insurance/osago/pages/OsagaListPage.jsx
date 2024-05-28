import React from 'react';
import styled from "styled-components";
import OsagaListContainer from "../containers/OsagaListContainer";

const Styled = styled.div`
`;
const OsagaListPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <OsagaListContainer/>
        </Styled>
    );
};

export default OsagaListPage;