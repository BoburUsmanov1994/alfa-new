import React from 'react';
import styled from "styled-components";
import OsagaViewContainer from "../containers/OsagaViewContainer";
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
const OsagaViewPage = ({...rest}) => {
    const {application_number  = null} = useParams();
    return (
        <Styled {...rest}>
            <OsagaViewContainer application_number={application_number }/>
        </Styled>
    );
};

export default OsagaViewPage;