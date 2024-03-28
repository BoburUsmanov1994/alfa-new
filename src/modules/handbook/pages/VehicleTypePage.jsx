import React from 'react';
import styled from "styled-components";
import VehicleTypeContainer from "../containers/VehicleTypeContainer";


const Styled = styled.div`
`;
const VehicleTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <VehicleTypeContainer/>
        </Styled>
    );
};

export default VehicleTypePage;