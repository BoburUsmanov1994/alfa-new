import React from 'react';
import styled from "styled-components";
import SectorTypeContainer from "../containers/SectorTypeContainer";

const Styled = styled.div`
`;
const SectorTypePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <SectorTypeContainer />
        </Styled>
    );
};

export default SectorTypePage;