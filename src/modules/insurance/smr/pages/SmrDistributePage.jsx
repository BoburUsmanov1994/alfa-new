import React from 'react';
import styled from "styled-components";
import SmrDistributeContainer from "../containers/SmrDistributeContainer";

const Styled = styled.div`
    .form-group{
      margin-bottom: 0;
    }
`;
const SmrDistributePage = ({...rest}) => {
    return (
        <Styled {...rest}>
            <SmrDistributeContainer/>
        </Styled>
    );
};

export default SmrDistributePage;