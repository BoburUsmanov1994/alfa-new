import React from 'react';
import styled from "styled-components";
import {ceil, isEqual, range} from "lodash"
import classNames from "classnames";
import {ChevronLeft,ChevronRight} from "react-feather";
import ReactPaginate from "react-paginate";

const Styled = styled.ul`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  margin-top: 25px;
flex-wrap: wrap;
  li {

    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #CCCCCC;
    color: #A4A4A4;
    font-family: 'Gilroy-Medium', sans-serif;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    margin-right: 10px;
    cursor: pointer;
    margin-bottom: 5px;
    a{
      display: flex;
      width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
    }
    &:last-child{
      margin-right: 0;
    }

    &.selected {
      background-color: #13D6D1;
      border-color: #13D6D1;
      color: #fff;
    }
  }
`;
const Pagination = ({
                        totalItems = 0,
                        limit = 15,
                        page = 1,
                        setPage = () => {
                        },
                        ...rest
                    }) => {
    const count = ceil(totalItems / limit)
    return (
        <Styled {...rest}>
            <ReactPaginate forcePage={page - 1} onPageChange={({selected}) => setPage(selected + 1)}
                           pageCount={count}
                           nextLabel={<ChevronRight />}
                           previousLabel={<ChevronLeft />} className={'pagination d-flex'}/>
        </Styled>
    );
};

export default Pagination;