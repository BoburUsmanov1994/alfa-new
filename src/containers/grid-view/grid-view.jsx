import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import GridTable from "./components/grid-table";
import GridTableBody from "./components/grid-table-body";
import {Col, Row} from "react-grid-system";
import Title from "../../components/ui/title";
import {get, includes, isEmpty, isEqual, entries, last, head, forEach} from "lodash"
import {
    useDeleteQuery,
    usePaginateQuery,
    usePostQuery,
    usePutQuery
} from "../../hooks/api";
import ErrorPage from "../../modules/auth/pages/ErrorPage";
import {OverlayLoader} from "../../components/loader";
import GridModal from "./components/grid-modal";
import Button from "../../components/ui/button";
import Panel from "../../components/panel"
import Search from "../../components/search";
import Section from "../../components/section";
import Swal from "sweetalert2";
import EmptyPage from "../../modules/auth/pages/EmptyPage";
import Pagination from "../../components/pagination";
import {useNavigate} from 'react-router-dom'
import Flex from "../../components/flex";
import Dropdown from "../../components/dropdown";
import {Check, ChevronUp, Menu} from "react-feather";
import {useTranslation} from "react-i18next";


const Styled = styled.div`
  .w-100 > div:first-child {
    width: 100%;
  }

  .dropDown__button {
    margin-top: 10px;
    margin-left: 15px;
    cursor: pointer;
  }

  .dropDown__body {
    width: 200px !important;
  }

  .column__filter {
    padding: 12px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px;
      margin-bottom: 5px;
      cursor: pointer;

      &:first-child {
        border-bottom: 1px solid #DCDCDC;
        cursor: default;
      }
    }
  }
`;
const GridView = ({
                      TableBody = GridTableBody,
                      ModalBody = () => <h2>Modal body</h2>,
                      tableHeaderData = [],
                      title = '',
                      keyId,
                      url,
                      createUrl = null,
                      updateUrl = null,
                      viewUrl = null,
                      responseDataKey = 'data',
                      hidePagination = false,
                      listUrl = null,
                      hideDeleteBtn = false,
                      hideCreateBtn = false,
                      params = {},
                      hasUpdateBtn = false,
                      isFormData = false,
                      dataKey = '_id',
                      deleteUrl = null,
                      extraActions = () => {
                      },
                      extraFilters = <></>,
                      deleteQueryParam = null,
                      viewIsTab=false,
                      checkStatus=null,
    getPagination = () => {},
                  }) => {
    const navigate = useNavigate()
    const {t} = useTranslation()
    const [openModal, setOpenModal] = useState(false)
    const [rowId, setRowId] = useState(null)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(15)
    const [columns, setColumns] = useState([])
    const {data, isError, isLoading, isFetching} = usePaginateQuery({
        key: keyId,
        url: listUrl ?? url,
        page,
        limit,
        params: {params}
    })
    const {mutate: createRequest, isLoading: postLoading} = usePostQuery({listKeyId: keyId})
    const {mutate: updateRequest, isLoading: putLoading} = usePutQuery({listKeyId: keyId})
    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: keyId})

    useEffect(() => {
        if (!isEmpty(tableHeaderData)) {
            setColumns(tableHeaderData)
        }
    }, [tableHeaderData])
    useEffect(() => {
        if (page && limit) {
            getPagination({page,limit})
        }
    }, [page,limit])

    const create = ({data}) => {
        if (isFormData) {
            const formData = new FormData();
            forEach(entries(data), (_item) => {
                formData.append(head(_item), last(_item))
            })
            createRequest({
                url, attributes: formData, config: {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            }, {
                onSuccess: () => {
                    setOpenModal(false)
                },
                onError: () => {
                    setOpenModal(false)
                }
            })
        } else {
            createRequest({url, attributes: data}, {
                onSuccess: () => {
                    setOpenModal(false)
                },
                onError: () => {
                    setOpenModal(false)
                }
            })
        }

    }

    const update = ({data}) => {
        const {password, ...rest} = data;
        if (rowId) {
            updateRequest({url: `${url}/${rowId}`, attributes: rest}, {
                onSuccess: () => {
                    setOpenModal(false)
                },
                onError: () => {
                    setOpenModal(false)
                }
            })
        }
    }

    const openEditModal = (id) => {
        setOpenModal(true);
        setRowId(id);
    }

    const remove = (id) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: t('Are you sure?'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: t('Delete'),
            cancelButtonText: t('Cancel'),
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                if (deleteUrl) {
                    if(deleteQueryParam) {
                        deleteRequest({url: `${deleteUrl}?${deleteQueryParam}=${id}`})
                    }
                   else{
                        deleteRequest({url: `${deleteUrl}/${id}`})
                    }
                } else {
                    deleteRequest({url: `${url}/${id}`})
                }
            }
        });
    }

    const hideColumn = (key, has) => {
        if (has) {
            setColumns(columns => columns.filter(col => !isEqual(get(col, 'key'), key)))
        } else {
            setColumns(columns => [...columns, tableHeaderData.find(col => isEqual(get(col, 'key'), key))])
        }
    }

    if (isLoading || putLoading || postLoading || deleteLoading) {
        return <OverlayLoader/>
    }

    if (isError) {
        return <ErrorPage/>
    }
    return (
        <Styled>
            {title && <Panel>
                <Row align={'center'}>
                    <Col xs={!hideCreateBtn ? 10 : 12}>
                        <Title hideSplitter={true}>{title}</Title>
                    </Col>
                    <Col xs={2} className={'text-right'}>
                        {!hideCreateBtn && <Button lg onClick={() => {
                            if (createUrl) {
                                navigate(createUrl)
                                return
                            }
                            setOpenModal(true);
                            setRowId(null)
                        }}>
                            {t("Добавить")}
                        </Button>}
                    </Col>
                </Row>
            </Panel>}
            <Section>
                <Row>
                    <Col xs={12}>
                        {extraFilters}
                    </Col>
                    <Col xs={12}>
                        <GridModal
                            responseDataKey={responseDataKey}
                            keyId={keyId}
                            rowId={rowId}
                            url={url}
                            create={create}
                            update={update}
                            visible={openModal}
                            hide={() => setOpenModal(false)}
                            ModalBody={ModalBody}
                        />
                    </Col>

                </Row>
                {isEmpty(get(data, responseDataKey, [])) ? <EmptyPage/> : <>
                    <div className={'horizontal-scroll'}><GridTable checkStatus={checkStatus} viewIsTab={viewIsTab} hasUpdateBtn={hasUpdateBtn}
                                                                    hideDeleteBtn={hideDeleteBtn}
                                                                    viewUrl={viewUrl}
                                                                    updateUrl={updateUrl}
                                                                    page={page}
                                                                    TableBody={TableBody}
                                                                    tableHeaderData={columns}
                                                                    remove={remove}
                                                                    openEditModal={openEditModal}
                                                                    tableBodyData={get(data, responseDataKey, [])}
                                                                    isFetching={isFetching}
                                                                    dataKey={dataKey}
                                                                    extraActions={extraActions}
                    /></div>
                    {!hidePagination &&
                        <Pagination page={page} setPage={setPage} totalItems={get(data, `data.count`, 0)}/>}
                </>}
            </Section>
        </Styled>
    );
};

export default GridView;
