import React from 'react';
import {get, isArray} from "lodash";
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
                           hideDeleteBtn = false
                       }) => {
    const navigate = useNavigate();
    console.log('tableBodyData',tableBodyData)
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
                                                  value={get(tr, `${get(td, 'key')}`, 0)}/> : get(td, 'date', false) ? dayjs(get(tr, `${get(td, 'key')}`, new Date())).format(get(td, 'dateFormat', "DD.MM.YYYY")) : get(tr, `${get(td, 'key')}`, '-')
                            }
                        </td>)
                    }
                    <td>{viewUrl && <Eye onClick={() => navigate(`${viewUrl}/${get(tr, '_id', null)}`)}
                                         className={'cursor-pointer mr-10'} size={20} color={'#78716c'}/>}
                        {updateUrl && <Edit
                            onClick={() => {
                                if (updateUrl) {
                                    navigate(`${updateUrl}/${get(tr, '_id', null)}`)
                                    return
                                }
                                openEditModal(get(tr, '_id', null))
                            }} className={'cursor-pointer mr-10'} size={20}
                            color={'#13D6D1'}/>}
                        {!hideDeleteBtn && <Trash2 onClick={() => remove(get(tr, '_id', null))}
                                                   className={'cursor-pointer '} size={20} color={'#dc2626'}/>}</td>
                </tr>)
            }
        </>
    );
};

export default GridTableBody;