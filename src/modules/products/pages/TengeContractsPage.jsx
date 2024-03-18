import React from 'react';
import styled from "styled-components";
import TengeContractsContainer from "../containers/TengeContractsContainer";

const Styled = styled.div`
  label{
    display: none;
  }
  label + div>span{
    display: none;
  }
`;
const TengeContractsPage = ({
                                ...rest
                            }) => {
    return (
        <Styled {...rest}>
            <TengeContractsContainer/>
        </Styled>
    );
};

export default TengeContractsPage;