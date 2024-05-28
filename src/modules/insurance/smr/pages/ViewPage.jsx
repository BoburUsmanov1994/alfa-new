import React from 'react';
import styled from "styled-components";
import ViewContainer from "../containers/ViewContainer";
import {useParams} from "react-router-dom";

const Styled = styled.div`
  .w-100 {
    & > div {
      width: 100%;
    }
  }
  .form-group {
    margin-bottom: 0;
  }
`;
const ViewPage = ({...rest}) => {
    const {contract_id = null} = useParams();
    return (
        <Styled {...rest}>
            <ViewContainer contract_id={contract_id}/>
        </Styled>
    );
};

export default ViewPage;