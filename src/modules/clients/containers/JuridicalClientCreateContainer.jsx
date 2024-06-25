import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, upperCase} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import {PERSON_TYPE} from "../../../constants";
import {getSelectOptionsListFromData} from "../../../utils";

const JuridicalClientCreateContainer = ({...rest}) => {
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(null)
    const [inn, setInn] = useState(null)
    const [regionId, setRegionId] = useState(null)

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


    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.clients})
    const create = ({data}) => {
        createRequest({
            url: URLS.clients,
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
                        <Title>Client create</Title>
                    </Col>
                </Row>
                <Form
                    footer={<Button>Save</Button>} formRequest={(values) => create(values)}>
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
                                        <Field onChange={(e) => setInn(e.target.value)} property={{
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
                            <Field params={{required: true}} defaultValue={get(organization, 'name')}
                                   label={'Наименование'} type={'input'}
                                   name={'organization.name'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field label={'Руководитель'} type={'input'}
                                   name={'organization.representativeName'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field label={'Должность'} type={'input'}
                                   name={'organization.position'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(organization, 'email')} label={'Email'} type={'input'}
                                   name={'organization.email'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(organization, 'phone')} params={{
                                required: true,
                            }}
                                   property={{placeholder: '998XXXXXXXXX'}}
                                   label={'Телефон'} type={'input'}
                                   name={'organization.phone'}/>
                        </Col>
                        <Col xs={4}><Field defaultValue={get(organization, 'oked')}
                                           label={'Oked'} params={{required: true, valueAsString: true}}
                                           type={'input'}
                                           name={'organization.oked'}/></Col>

                        <Col xs={4} className={'mb-25'}>
                            <Field label={'Расчетный счет'} type={'input'}
                                   name={'organization.checkingAccount'}/>
                        </Col>
                        <Col xs={4}><Field label={'Форма собственности'}
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
                        <Col xs={4}><Field label={'Область'} params={{required: true}} property={{
                            onChange: (val) => setRegionId(val)
                        }} options={regionList}
                                           type={'select'}
                                           name={'organization.region'}/></Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(organization, 'districtId')}
                                label={'District'}
                                type={'select'}
                                name={'organization.district'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(organization, 'address')}
                                label={'Address'}
                                type={'input'}
                                name={'organization.address'}/>
                        </Col>

                        <Col xs={4} className={'mb-25'}>
                            <Field
                                label={'isUseOurPanel?'}
                                type={'switch'}
                                name={'isUseOurPanel'}
                            />
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                label={'isUseRestAPI?'}
                                type={'switch'}
                                name={'isUseRestAPI'}
                            />
                        </Col>
                        <Col xs={1} className={'mt-15'}>
                            <Field
                                property={{disabled: true, type: 'hidden', hideLabel: true}}
                                defaultValue={inn}
                                type={'input'}
                                name={'organization.inn'}/>
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default JuridicalClientCreateContainer;