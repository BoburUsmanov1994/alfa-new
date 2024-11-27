import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import {Col, Row} from "react-grid-system";
import Panel from "../../../components/panel";
import Search from "../../../components/search";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import {useDeleteQuery, useGetOneQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import Table from "../../../components/table";
import {Download, Trash2} from "react-feather";
import Flex from "../../../components/flex";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {useTranslation} from "react-i18next";
import {request} from "../../../services/api";
import {saveFile} from "../../../utils";
import FilePreview from "../../../components/file-preview";


const ProductViewContainer = ({id, ...rest}) => {
    const {t} = useTranslation();

    const navigate = useNavigate();

    let {data, isLoading} = useGetOneQuery({id, key: KEYS.product, url: `${URLS.product}/show`})

    const {mutate: deleteRequest, isLoading: deleteLoading} = useDeleteQuery({listKeyId: KEYS.products})

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t('Продукты'),
            path: '/products',
        },
        {
            id: 2,
            title: get(data, 'data.data.productname'),
            path: '#',
        }
    ], [data])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [get(data, 'data.data')])

    const remove = (val) => {
        Swal.fire({
            position: 'center',
            icon: 'error',
            backdrop: 'rgba(0,0,0,0.9)',
            background: 'none',
            title: 'Are you sure?',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#13D6D1',
            confirmButtonText: 'Delete',
            customClass: {
                title: 'title-color',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                deleteRequest({url: `${URLS.products}/${val}`})
                navigate('/products/all')
            }
        });
    }

    const product = get(data, 'data', {})

    if (isLoading) {
        return <OverlayLoader/>
    }
    return (
        <>
            {deleteLoading && <ContentLoader/>}
            <Panel>
                <Row>
                    <Col xs={12}>
                        <Search/>
                    </Col>
                </Row>
            </Panel>
            <Section>
                <Row>
                    <Col xs={12}>
                        <Flex className={'w-100'}>
                            <Title>{get(product, 'name', t('Product'))}</Title>
                            {/*<Edit onClick={()=>navigate(`/products/update/${id}`)} className={'cursor-pointer mr-10 ml-15'} size={28} color={'#13D6D1'}/>*/}
                            <Trash2 onClick={() => remove(id)}
                                    className={'cursor-pointer '} size={28} color={'#dc2626'}/>
                        </Flex>
                    </Col>
                </Row>
                <Row>
                    <Col xs={6}>

                        <Table thead={['1', '2']}>
                            <tr>
                                <td>{t("Категория")}</td>
                                <td><strong>{get(product, 'group.name', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Под категория")}</td>
                                <td><strong>{get(product, 'subGroup.name', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("codeproduct")}</td>
                                <td><strong>{get(product, 'code', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Работа по версии продукта (Версия продукта)")}</td>
                                <td><strong>{get(product, 'version', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Тип страховщика")}</td>
                                <td><strong>{get(product, 'personType', []).map(({name}) => name).join(" , ")}</strong>
                                </td>

                            </tr>
                            <tr>
                                <td>{t("Наименование продукта")}</td>
                                <td><strong>{get(product, 'name', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Статус договора")}</td>
                                <td><strong>{get(product, 'status.name', '-')}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Требует разрешения")}</td>
                                <td><strong>{get(product, 'isRequirePermission', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Тип полиса")}</td>
                                <td><strong>{get(product, 'policyTypes', []).map(({name}) => name).join(" , ")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Разрешить несколько агентов")}</td>
                                <td><strong>{get(product, 'allowMultipleAgents', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет фиксированный превентивных мероприятий")}</td>
                                <td><strong>{get(product, 'fixedPreventiveMeasures', false) ? 'Да' : 'Нет'}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Разрешить иностранную валюту")}</td>
                                <td><strong>{get(product, 'allowForeignCurrency', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Разрешение изменение франшизы")}</td>
                                <td><strong>{get(product, 'allowChangeFranchise', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                    <Col xs={6}>
                        <Table thead={['1', '2']}>
                            {get(product, 'applicationForm._id') && <tr>
                                <td>{t("Форма анкеты")}</td>

                                <td>
                                    {get(product, 'applicationForm._id') && <FilePreview fileId={get(product, 'applicationForm._id')} />}
                                    </td>
                            </tr>}
                            {get(product, 'contractForm._id') && <tr>
                                <td>{t("Договор")}</td>
                                <td>
                                    {get(product, 'contractForm._id') && <FilePreview fileId={get(product, 'contractForm._id')} />}
                                </td>
                            </tr>}
                            {get(product, 'additionalDocuments._id') && <tr>
                                <td>{t("Приложения")}</td>
                                <td>
                                    {get(product, 'additionalDocuments._id') && <FilePreview fileId={get(product, 'additionalDocuments._id')} />}
                                </td>
                            </tr>}
                            <tr>
                                <td>{t("Имеет фиксированного страхователя")}</td>
                                <td><strong>{get(product, 'hasFixedPolicyHolder', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет выгодоприобретеля")}</td>
                                <td><strong>{get(product, 'hasBeneficary', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет фиксированного выгодоприобретеля")}</td>
                                <td><strong>{get(product, 'hasFixedBeneficary', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет фиксированную страховую сумму")}</td>
                                <td><strong>{get(product, 'hasFixedFee', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Разрешить полис без оплаты")}</td>
                                <td><strong>{get(product, 'allowPolicyWithoutPayment', false) ? 'Да' : 'Нет'}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Тип оплаты")}</td>
                                <td>
                                    <strong>{get(product, 'paymentType', []).map(({name}) => name).join(" , ")}</strong>
                                </td>
                            </tr>
                            <tr>
                                <td>{t("Имеет фиксированную комиссию")}</td>
                                <td><strong>{get(product, 'hasFixedFee', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет диапазон ставок")}</td>
                                <td><strong>{get(product, 'hasBettingRange', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                            <tr>
                                <td>{t("Имеет франшизу")}</td>
                                <td><strong>{get(product, 'allowChangeFranchise', false) ? 'Да' : 'Нет'}</strong></td>
                            </tr>
                        </Table>
                    </Col>
                </Row>
            </Section>
        </>
    );
};

export default ProductViewContainer;