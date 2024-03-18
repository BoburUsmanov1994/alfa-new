import React from 'react';
import styled from "styled-components";
import WarehouseContainer from "../containers/WarehouseContainer";


const Styled = styled.div`
`;
const WarehousePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <WarehouseContainer/>
        </Styled>
    );
};

export default WarehousePage;