import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, includes, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Form from "../../../containers/form/form";
import {Col, Row} from "react-grid-system";
import config from "../../../config";
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {Filter, Trash} from "react-feather";
import {useTranslation} from "react-i18next";

const PaymentsContainer = () => {
    const {t} = useTranslation();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const [filter, setFilter] = useState({})
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Платежи за финансовые риски',
            path: '/policy/payments',
        },
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'number'} type={'input'} label={'номер полиса'} defaultValue={rowId ? get(data,'number'):null} params={{required: true}} />
        <Field  name={'seria'} type={'input'} label={'серия полиса'} defaultValue={rowId ? get(data,'seria'):null} params={{required: true}} />
        <Field  name={'paymentSum'} type={'number-format-input'} label={'сумма выплаты'} defaultValue={rowId ? get(data,'paymentSum'):null} params={{required: true}} />
        <Field  name={'paymentDate'} type={'datepicker'} label={'дата выплаты'} defaultValue={rowId ? get(data,'paymentDate'):null} params={{required: true}} />
        <Field  name={'addDate'} type={'datepicker'} label={'дата добавления'} defaultValue={rowId ? get(data,'addDate'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                extraFilters={<Form sm formRequest={({data: {...rest} = {}}) => {
                    setFilter(rest);
                }}
                                    mainClassName={'mt-15'}>

                    {() => <Row align={'end'} gutterWidth={10}>
                        <Col xs={4}>
                            <Field  type={'input'}
                                    label={t("Номер полиса")} name={'number'}
                                     defaultValue={get(filter, 'number')}
                                    />
                        </Col>

                        <Col xs={3}>
                            <div style={{display:'flex',marginBottom:'12px',marginLeft:'15px'}}>
                                <Button  htmlType={'submit'}><Flex justify={'center'}><Filter size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Применить")}</span></Flex></Button>
                                <Button className={'ml-15'}  onClick={() => {
                                    setFilter({})
                                }}  danger type={'reset'}><Flex justify={'center'}><Trash
                                    size={14}/><span
                                    style={{marginLeft: '5px'}}>{t("Очистить")}</span></Flex></Button>
                            </div>
                        </Col>
                    </Row>}
                </Form>}
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'number',
                        title: 'номер полиса'
                    },
                    {
                        id: 3,
                        key: 'seria',
                        title: 'серия полиса'
                    },
                    {
                        id: 4,
                        key: 'paymentDate',
                        title: 'дата выплаты',
                        render: (_tr) => dayjs(get(_tr, 'paymentDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 33,
                        key: 'paymentSum',
                        title: 'сумма выплаты',
                        render: (_tr)=><NumberFormat displayType={'text'} thousandSeparator={' '} value={get(_tr,'paymentSum')} />
                    },
                    {
                        id: 5,
                        key: 'addDate',
                        title: 'дата добавления',
                        render: (_tr) => dayjs(get(_tr, 'addDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 6,
                        key: 'isActive',
                        title: 'статус',
                        render: (_tr)=>!isEqual(get(_tr, 'isActive'),false) ? 'активный':'удален'
                    },
                ]}
                keyId={[KEYS.policyPayments,filter]}
                params={{
                    ...filter,
                }}
                url={URLS.policyPayments}
                listUrl={`${URLS.policyPayments}/list`}
                title={'Платежи за финансовые риски'}
                hasUpdateBtn
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default PaymentsContainer;