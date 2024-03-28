import React from 'react';
import styled from "styled-components";
import MeasurementTypeContainer from "../containers/MeasurementTypeContainer";


const Styled = styled.div`
`;
const MeasurementTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <MeasurementTypeContainer/>
        </Styled>
    );
};

export default MeasurementTypePage;