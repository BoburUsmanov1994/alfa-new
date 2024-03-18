import React from 'react';
import styled from "styled-components";
import CitizenshipContainer from "../containers/CitizenshipContainer";
import ReasonsContainer from "../containers/ReasonsContainer";


const Styled = styled.div`
`;
const ReasonsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <ReasonsContainer/>
        </Styled>
    );
};

export default ReasonsPage;