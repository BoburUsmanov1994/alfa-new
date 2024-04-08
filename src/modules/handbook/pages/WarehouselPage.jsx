import React from 'react';
import styled from "styled-components";
import WarehouseContainer from "../containers/WarehouseContainer";


const Styled = styled.div`
  .rodal-dialog{
    width: 650px !important;
  }
`;
const WarehousePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <WarehouseContainer/>
        </Styled>
    );
};

export default WarehousePage;