import React from 'react';
import styled from "styled-components";
import CitizenshipContainer from "../containers/CitizenshipContainer";



const Styled = styled.div`
`;
const CitizenshipPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <CitizenshipContainer />
        </Styled>
    );
};

export default CitizenshipPage;