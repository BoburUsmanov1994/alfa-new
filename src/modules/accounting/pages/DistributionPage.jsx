import React from 'react';
import DistributionContainer from "../containers/DistributionContainer";
import styled from "styled-components";

const Styled = styled.div`
.form-group{
  margin-bottom: 0;
  
}
`;
const DistributionPage = ({
                              ...rest
                          }) => {
    return (
        <Styled {...rest}>
            <DistributionContainer/>
        </Styled>
    );
};

export default DistributionPage;