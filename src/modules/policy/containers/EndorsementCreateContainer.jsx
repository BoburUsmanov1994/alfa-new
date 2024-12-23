import React from 'react';
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import Section from "../../../components/section";
import Button from "../../../components/ui/button";
import Field from "../../../containers/form/field";
import Form from "../../../containers/form/form";
import {useTranslation} from "react-i18next";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {ContentLoader, OverlayLoader} from "../../../components/loader";
import {Navigate, useNavigate} from "react-router-dom";
import {find, get, isEqual} from "lodash"
import {getFieldType, getSelectOptionsListFromData} from "../../../utils";


const EndorsementCreateContainer = ({
                             product_id = null,
                             ...rest
                         }) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    let {data: endorsementFieldTypeList,isLoading,isError} = useGetAllQuery({key: KEYS.fieldofendorsements, url: URLS.fieldofendorsements})

    const {mutate: createEndorsement, isLoading: isLoadingEndorsement} = usePostQuery({listKeyId: KEYS.agreements})

    let {data: endorsementTypeList} = useGetAllQuery({key: KEYS.typeofendorsements, url: URLS.typeofendorsements})
    endorsementTypeList = getSelectOptionsListFromData(get(endorsementTypeList, `data.data`, []), '_id', 'name')


    let {data: endorsementStatusList} = useGetAllQuery({key: KEYS.statusofendorsements, url: URLS.statusofendorsements})
    endorsementStatusList = getSelectOptionsListFromData(get(endorsementStatusList, `data.data`, []), '_id', 'name')

    const addEndorsement = (data) => {
        createEndorsement({
            url: URLS.endorsements, attributes: {
                ...data,
                agreementsId: product_id,
            }
        }, {
            onSuccess: () => {
                navigate(`/agreements/view/${product_id}`)
            },
            onError: () => {
            }
        })
    }

    if (isError) {
        return <Navigate to={'/500'}/>
    }

    if (isLoading) {
        return <OverlayLoader/>;
    }

    const getEndorsementTitle = (list = [],id = null) => {
        return get(find(list,(item)=>isEqual(get(item,"value"),`${id}`)),'label')
    }

    return (
        <Section>
            {isLoadingEndorsement && <ContentLoader/>}
            <Row className={'mb-15'} align={'center'}>
                <Col xs={12}>
                    <Title>{t("Add endorsement")}</Title>
                </Col>
            </Row>
            <Form formRequest={({data}) => {
                addEndorsement(data);
            }}
                  footer={<><Button>{t("Add")}</Button></>}>
                <Row>
                    <Col xs={12}>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Field label={t('Endorsement type')} options={endorsementTypeList} type={'select'}
                                       name={'typeofendorsements'} params={{required: true}}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field label={t('reqforconclusion')} type={'input'}
                                       name={'reqforconclusion'} params={{required: true}}
                                />
                            </Col>

                            <Col xs={4}>
                                <Field label={t('Endorsement status')} options={endorsementStatusList} type={'select'}
                                       name={'statusofendorsements'} params={{required: true}}
                                />
                            </Col>

                        </Row>
                        {
                            get(endorsementFieldTypeList,'data.data',[]).map((item,index) => <Row key={get(item,'_id')}>
                                <Col xs={12} className={'mb-15'}>
                                    <Title sm>{getEndorsementTitle(endorsementTypeList,get(item,"typeofendorsements"))}</Title>
                                </Col>
                                {
                                    get(item,'filds',[]).map(field => <Col xs={4} key={get(field,"_id")}>
                                        <Field label={get(field,'titleoffield')} type={getFieldType(get(field,'typeoffield'))}
                                               name={`endorsementsinfo[${index}].${get(field,'nameoffield')}`}
                                        />
                                    </Col>)
                                }
                            </Row>)
                        }
                    </Col>

                </Row>
            </Form>
        </Section>
    );
};

export default EndorsementCreateContainer;