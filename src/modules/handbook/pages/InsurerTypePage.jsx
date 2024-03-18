import React from 'react';
import styled from "styled-components";
import InsurerTypeContainer from "../containers/InsurerTypeContainer";

const Styled = styled.div`
`;
const InsurerTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <InsurerTypeContainer />
        </Styled>
    );
};

export default InsurerTypePage;