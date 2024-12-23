import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../store";
import {get, head, isEmpty, isNil} from "lodash";
import {useTranslation} from "react-i18next";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Dropzone from 'react-dropzone'
import Button from "../../../components/ui/button";
import Flex from "../../../components/flex";
import {ContentLoader} from "../../../components/loader";
import {usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {toast} from "react-toastify";
import EmptyPage from "../../auth/pages/EmptyPage";
import Table from "../../../components/table";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import {useNavigate} from "react-router-dom";

const ImportPaymentDocumentContainer = ({
                                            ...rest
                                        }) => {
    const [file,setFile] = useState(null)
    const [items,setItems] = useState([])
    const {t} = useTranslation()
    const navigate = useNavigate()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {mutate: uploadFile, isLoading} = usePostQuery({listKeyId: KEYS.transactions})

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Бухгалтерия'),
            path: '/accounting',
        },
        {
            id: 2,
            title: t('Импорт платёжные документы'),
            path: '#',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const upload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        if(!isNil(file)) {
            uploadFile({
                url: URLS.transactions, attributes: formData, config: {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            }, {
                onSuccess: ({data}) => {
                    setItems(get(data,'data',get(data,'logs',[])))
                },
                onError: () => {

                }
            })
        }else{
            toast.warn('Please select file')
        }
    }

    return (
        <Section>
            {isLoading && <ContentLoader />}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>{t("Результат импорта")}</Title>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={6}>
                    <Dropzone  multiple={false} onDrop={acceptedFile =>setFile(head(acceptedFile))}>
                        {({getRootProps, getInputProps}) => (
                            <section>
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                   <Flex><span style={{marginRight:'15px'}}>{get(file,'path') ?? 'No file selected'}</span> <Button>{t("Выбрать")}</Button></Flex>
                                </div>
                            </section>
                        )}
                    </Dropzone>
                </Col>
            </Row>
            <Row className={'mb-20'}>
                <Col xs={12}>
                    {isEmpty(items) ? <EmptyPage /> : <Table hideThead={false} thead={['№','Номер док.','МФО','Счет клиента','Наименование клиента','ИНН кл-нт','МФО','Счет корреспондента','ИНН кор-т','Наименование корреспондента','Сумма документа','Назначение платежа','Дата']}>{items.map((item,i) => <tr key={get(item,'_id')}>

                        <td >{i+1}</td>
                        <td>{get(item,'payment_order_number')}</td>
                        <td>{get(item,'sender_bank_code')}</td>
                        <td>{get(item,'sender_bank_account')}</td>
                        <td>{get(item,'sender_name')}</td>
                        <td>{get(item,'sender_taxpayer_number')}</td>
                        <td>{get(item,'recipient_bank_code')}</td>
                        <td>{get(item,'recipient_bank_account')}</td>
                        <td>{get(item,'recipient_taxpayer_number')}</td>
                        <td>{get(item,'recipient_name')}</td>
                        <td><NumberFormat displayType={'text'} thousandSeparator={" "} value={get(item,'payment_amount',0)}/></td>
                        <td>{get(item,'payment_details')}</td>
                        <td>{get(item,'payment_order_date')}</td>
                    </tr>)}</Table>}
                </Col>
            </Row>
            <Row className={'mt-32'}>
                <Col xs={12}>
                    {isEmpty(items) ? <Flex>
                        <Button type={'button'} className={'mr-16'} onClick={()=>upload(file)}>{t("Импортировать")}</Button>
                        <Button type={'button'} danger  onClick={()=>setFile(null)}>{t("Сбросить")}</Button>
                    </Flex> : <Button type={'button'} className={'mr-16'} onClick={()=>navigate('/accounting/distribution')}>{t("Распределять")}</Button>}
                </Col>
            </Row>
        </Section>
    );
};

export default ImportPaymentDocumentContainer;