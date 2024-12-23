import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import {Col, Row} from "react-grid-system";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {useTranslation} from "react-i18next";
import {useGetAllQuery, usePaginateQuery, usePostQuery} from "../../../hooks/api";
import Table from "../../../components/table";
import Form from "../../../containers/form/form";
import Field from "../../../containers/form/field";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import Pagination from "../../../components/pagination";
import {Download} from "react-feather";
import config from "../../../config";


const TengeContractsContainer = ({id, ...rest}) => {

    const {t} = useTranslation();
    const [page, setPage] = useState(1)

    let {data: contracts, isLoading, isFetching} = usePaginateQuery({
        key: KEYS.tengebankContracts,
        url: URLS.tengebankContracts,
        page
    })
    const {mutate: createRequest, isLoading: postLoading} = usePostQuery({listKeyId: KEYS.tengebankContracts})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Продукты"),
            path: '/products',
        },
        {
            id: 2,
            title: t("Tenge bank contracts"),
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    const handleChange = (val, id) => {
        if (val && id) {
            createRequest({url: URLS.tengebankContracts, attributes: {id, isAccepted: val}}, {
                onSuccess: () => {

                },
                onError: () => {

                }
            })
        }
    }


    if (isLoading) {
        return <OverlayLoader/>
    }

    return (
        <>
            <Panel>
                <Row>
                    <Col xs={12}>
                        <Search/>
                    </Col>
                </Row>
            </Panel>
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>{t('Tenge bank contracts')}</Title>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        {
                            (isFetching || postLoading) && <ContentLoader/>
                        }
                        <div className="horizontal-scroll">
                            <Table
                                thead={["№", t("Loan type"), t("Loan total"), t("Loan amount"), t("Loan term"),t("objectBrand"),t("objectName"),t("insuranceLiability"),t("insurancePremium"),t("insurancePremiumAuto"),t("insurancePremiumLoan"), t("Subject"), t("Organization/Customer"), t("Contract number"), t("Contract date"), t("Loan contract number"), t("Payment date"), t("Policy"), t("Created date"), t("Accepted")]}
                                hideThead={false}>
                                {
                                    contracts && get(contracts, 'data.data', []).map((item, i) => <tr key={i + 1}>
                                        <td>{(page - 1) * 20 + (i + 1)}</td>
                                        <td>{get(item, 'loan.loanType', '-')}</td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'loan.loanTotal', 0)}/></td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'loan.loanAmount', 0)}/></td>
                                        <td>{get(item, 'loan.loanTerm', '-')}</td>
                                        <td>{get(item, 'loan.objectBrand', '-')}</td>
                                        <td>{get(item, 'loan.objectName', '-')}</td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'insuranceLiability', 0)}/></td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'insurancePremium', 0)}/></td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'insurancePremiumAuto', 0)}/></td>
                                        <td><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                          value={get(item, 'insurancePremiumLoan', 0)}/></td>
                                        <td>{get(item, 'subject', '-')}</td>
                                        <td>{isEqual(get(item, 'subject', '-'), 'P') ? get(item, 'customer.fullName', '-') : get(item, 'organization.name', '-')}</td>
                                        <td>{get(item, 'contractNumber', '-')}</td>
                                        <td>{dayjs(get(item, 'contractDate', '-')).format("DD-MM-YYYY")}</td>
                                        <td>{get(item, 'loanContractNumber', '-')}</td>
                                        <td>{dayjs(get(item, 'paymentDate', '-')).format("DD-MM-YYYY")}</td>
                                        <td>{get(item, 'policy.filePath') ? <a href={`${config.FILE_URL}${get(item,'policy.filePath','#')}`} target={'_blank'} download><Download color={'#13D6D1'} /></a>:"-"}</td>
                                        <td>{dayjs(get(item, 'createdAt', '-')).format("DD-MM-YYYY")}</td>
                                        <td>
                                            <Form>
                                                <Field
                                                    property={{handleChange: (val) => handleChange(val, get(item, "_id", null))}}
                                                    name={'accepted'} type={'switch'}
                                                    defaultValue={get(item, 'isAccepted', false)} options={[]}
                                                    disabled={get(item, 'isAccepted', false)}/>
                                            </Form>
                                        </td>
                                    </tr>)
                                }

                            </Table>

                        </div>
                        <Pagination page={page} setPage={setPage} totalItems={get(contracts, `data.totalItems`, 0)}/>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default TengeContractsContainer;