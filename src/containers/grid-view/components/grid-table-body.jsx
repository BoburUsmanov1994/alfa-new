import React from 'react';
import {get, isArray,isFunction} from "lodash";
import {Trash2, Edit, Eye} from "react-feather";
import {useNavigate} from "react-router-dom";
import NumberFormat from 'react-number-format';
import dayjs from "dayjs";

const GridTableBody = ({
                           tableHeaderData = [],
                           tableBodyData = [],
                           remove = () => {
                           },
                           openEditModal = () => {
                           },
                           page,
                           viewUrl = null,
                           updateUrl = null,
                           hideDeleteBtn = false,
                           hasUpdateBtn = false,
                           dataKey
                       }) => {
    const navigate = useNavigate();
    return (
        <>
            {
                tableBodyData && isArray(tableBodyData) && tableBodyData?.map((tr, i) => <tr key={get(tr, '_id', i)}>
                    <td>{(page - 1) * 10 + (i + 1)}</td>
                    {
                        tableHeaderData && isArray(tableHeaderData) && tableHeaderData?.map((td, j) => <td
                            key={get(td, 'id', j)}>
                            {
                                get(td, 'isArray') ? get(tr, `${get(td, 'key')}`, []).map(
                                    item => get(item, get(td, 'arrayKey', 'name'))
                                ).join(" , ") : get(td, 'hasNumberFormat', false) ?
                                    <NumberFormat displayType={'text'} thousandSeparator={" "}
                                                  value={get(tr, `${get(td, 'key')}`, 0)}/> : get(td, 'date', false) ? dayjs(get(tr, `${get(td, 'key')}`, new Date())).format(get(td, 'dateFormat', "DD.MM.YYYY")) : isFunction(get(td, 'render')) ? get(td, 'render')(tr) :get(tr, `${get(td, 'key')}`, '-')
                            }
                        </td>)
                    }
                    <td>{viewUrl && <Eye onClick={() => navigate(`${viewUrl}/${get(tr, dataKey, null)}`)}
                                         className={'cursor-pointer mr-10'} size={20} color={'#78716c'}/>}
                        {hasUpdateBtn && <Edit
                            onClick={() => {
                                if (updateUrl) {
                                    navigate(`${updateUrl}/${get(tr, dataKey, null)}`)
                                    return
                                }
                                openEditModal(get(tr, dataKey, null))
                            }} className={'cursor-pointer mr-10'} size={20}
                            color={'#13D6D1'}/>}
                        {!hideDeleteBtn && <Trash2 onClick={() => remove(get(tr, dataKey, null))}
                                                   className={'cursor-pointer '} size={20} color={'#dc2626'}/>}</td>
                </tr>)
            }
        </>
    );
};

export default GridTableBody;