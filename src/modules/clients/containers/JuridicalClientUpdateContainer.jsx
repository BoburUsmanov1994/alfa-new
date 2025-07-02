import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, upperCase} from "lodash";
import {useGetAllQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import {PERSON_TYPE} from "../../../constants";
import {getSelectOptionsListFromData} from "../../../utils";

const JuridicalClientUpdateContainer = ({id}) => {
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const {data} = useGetAllQuery({
        key: [KEYS.clients,id], url: `${URLS.clients}/show/${id}`
    })
    const {data: country, isLoading: isLoadingCountry} = useGetAllQuery({
        key: KEYS.countries, url: `${URLS.countries}/list`
    })
    const countryList = getSelectOptionsListFromData(get(country, `data.data`, []), '_id', 'name')
    const {data: region, isLoading: isLoadingRegion} = useGetAllQuery({
        key: KEYS.regions, url: `${URLS.regions}/list`
    })
    const regionList = getSelectOptionsListFromData(get(region, `data.data`, []), '_id', 'name')

    const {data: district} = useGetAllQuery({
        key: [KEYS.districts, regionId],
        url: `${URLS.districts}/list`,
        params: {
            params: {
                region: regionId
            }
        },
        enabled: !!(regionId || get(organization, 'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.data`, []), '_id', 'name')

    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: `${URLS.ownershipForms}/list`
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.data`, []), '_id', 'name')
    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const getOrgInfo = (type = 'owner') => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn: inn
                }
            },
            {
                onSuccess: ({data}) => {
                    setOrganization(data)
                }
            }
        )
    }


    const {mutate: updateRequest, isLoading} = usePutQuery({listKeyId: KEYS.clients})
    const update = ({data}) => {
        updateRequest({
            url: `${URLS.clients}/${id}`,
            attributes: {
                ...data,
                type: PERSON_TYPE.organization,
            }
        }, {
            onSuccess: () => {
                navigate('/clients/juridical')
            },
            onError: () => {

            }
        })
    }

    return (
        <>
            {(isLoading || isLoadingOrganizationInfo) && <OverlayLoader/>}
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>Client update</Title>
                    </Col>
                </Row>
                <Form
                    footer={<Button>Save</Button>} formRequest={(values) => update(values)}>
                    <Row gutterWidth={60} className={'mt-15'}>
                        <Col xs={12}>
                            <Row>
                                <Col xs={3}>
                                    <Flex>
                                        <Button
                                            className={'mr-16'}
                                            type={'button'}>Юр.лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={9} className={'text-right'}>
                                    <Flex justify={'flex-end'} align={'flex-start'}>
                                        <Field defaultValue={get(data,'data.organization.inn')} onChange={(e) => setInn(e.target.value)} property={{
                                            hideLabel: true,
                                            mask: '999999999',
                                            placeholder: 'Inn',
                                            maskChar: '_'
                                        }} name={'inn'} type={'input-mask'}/>
                                        <Button onClick={() => getOrgInfo()} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>

                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>

                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(organization, 'name',get(data,'data.organization.name'))}
                                   label={'Наименование'} type={'input'}
                                   name={'organization.name'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(data,'data.organization.representativeName')} label={'Руководитель'} type={'input'}
                                   name={'organization.representativeName'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field  defaultValue={get(data,'data.organization.position')} label={'Должность'} type={'input'}
                                   name={'organization.position'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(organization, 'email',get(data,'data.organization.email'))} label={'Email'} type={'input'}
                                   name={'organization.email'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(organization, 'phone',get(data,'data.organization.phone'))} params={{
                                required: true,
                                pattern: {
                                    value: /^998[0-9]{9}$/,
                                    message: 'Invalid format'
                                }
                            }}
                                   property={{placeholder: '998XXXXXXXXX'}}
                                   label={'Телефон'} type={'input'}
                                   name={'organization.phone'}/>
                        </Col>
                        <Col xs={4}><Field defaultValue={get(organization, 'oked',get(data,'data.organization.oked'))}
                                           label={'Oked'} params={{required: true, valueAsString: true}}
                                           type={'input'}
                                           name={'organization.oked'}/></Col>

                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(data,'data.organization.checkingAccount')} label={'Расчетный счет'} type={'input'}
                                   name={'organization.checkingAccount'}/>
                        </Col>
                        <Col xs={4}><Field defaultValue={get(data,'data.organization.ownershipForm')} label={'Форма собственности'}
                                           options={ownershipFormList}
                                           type={'select'}
                                           name={'organization.ownershipForm'}/></Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                defaultValue={get(organization, 'birthCountry', 210)}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'organization.country'}/>
                        </Col>
                        <Col xs={4}><Field defaultValue={get(data,'data.organization.region')} label={'Область'} params={{required: true}} property={{
                            onChange: (val) => setRegionId(val)
                        }} options={regionList}
                                           type={'select'}
                                           name={'organization.region'}/></Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(organization, 'districtId',get(data,'data.organization.district'))}
                                label={'District'}
                                type={'select'}
                                name={'organization.district'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(organization, 'address',get(data,'data.organization.address'))}
                                label={'Address'}
                                type={'input'}
                                name={'organization.address'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                defaultValue={get(organization, 'representativeDoc',get(data,'data.organization.representativeDoc'))}
                                label={'Representative document'}
                                type={'input'}
                                name={'organization.representativeDoc'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                defaultValue={get(organization, 'representativeDocNumber',get(data,'data.organization.representativeDocNumber'))}
                                label={'Representative document number'}
                                type={'input'}
                                name={'organization.representativeDocNumber'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                defaultValue={get(organization, 'representativePinfl',get(data,'data.organization.representativePinfl'))}
                                label={'Representative PINFL'}
                                type={"input-mask"}
                                property={{ mask: "99999999999999", maskChar: "_" }}
                                name={'organization.representativePinfl'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                defaultValue={get(organization, 'representativePassportSeria',get(data,'data.organization.representativePassportSeria'))}
                                label={'Representative Passport Seria'}
                                type={"input-mask"}
                                property={{ mask: "aa", maskChar: "_" }}
                                name={'organization.representativePassportSeria'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                defaultValue={get(organization, 'representativePassportNumber',get(data,'data.organization.representativePassportNumber'))}
                                label={'Representative Passport Number'}
                                type={"input-mask"}
                                property={{ mask: "9999999", maskChar: "_" }}
                                name={'organization.representativePassportNumber'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(organization, 'bankMfo',get(data,'data.organization.bankMfo'))}
                                label={'Bank Mfo'}
                                type={"input"}
                                name={'organization.bankMfo'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(organization, 'bankName',get(data,'data.organization.bankName'))}
                                label={'Bank name'}
                                type={"input"}
                                name={'organization.bankName'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(organization, 'bankInn',get(data,'data.organization.bankInn'))}
                                label={'Bank Inn'}
                                type={"input-mask"}
                                property={{ mask: "999999999", maskChar: "_", }}
                                name={'organization.bankInn'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(data,'data.isUseOurPanel')}
                                label={'isUseOurPanel?'}
                                type={'switch'}
                                name={'isUseOurPanel'}
                            />
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(data,'data.isUseRestAPI')}
                                label={'isUseRestAPI?'}
                                type={'switch'}
                                name={'isUseRestAPI'}
                            />
                        </Col>
                        <Col xs={1} className={'mt-15'}>
                            <Field
                                property={{disabled: true, type: 'hidden', hideLabel: true}}
                                defaultValue={inn ?? get(data,'data.organization.inn')}
                                type={'input'}
                                name={'organization.inn'}/>
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default JuridicalClientUpdateContainer;
