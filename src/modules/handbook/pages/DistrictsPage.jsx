import React from 'react';
import styled from "styled-components";
import DistrictsContainer from "../containers/DistrictsContainer";

const Styled = styled.div`
`;
const DistrictsPage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <DistrictsContainer/>
        </Styled>
    );
};

export default DistrictsPage;