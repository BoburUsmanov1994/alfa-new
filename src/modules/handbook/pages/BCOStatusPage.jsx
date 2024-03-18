import React from 'react';
import styled from "styled-components";
import BCOStatusContainer from "../containers/BCOStatusContainer";


const Styled = styled.div`
`;
const BCOStatusPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <BCOStatusContainer/>
        </Styled>
    );
};

export default BCOStatusPage;