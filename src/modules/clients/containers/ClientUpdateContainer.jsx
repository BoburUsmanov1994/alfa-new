import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, head, upperCase} from "lodash";
import {useGetAllQuery, usePostQuery, usePutQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import dayjs from "dayjs";
import {PERSON_TYPE} from "../../../constants";
import {getSelectOptionsListFromData} from "../../../utils";

const ClientUpdateContainer = ({id}) => {
    const navigate = useNavigate();
    const [person, setPerson] = useState(null)
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [regionId, setRegionId] = useState(null)
    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})

    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setPerson(data);
                }
            }
        )
    }
    const {data} = useGetAllQuery({
        key: [KEYS.clients,id], url: `${URLS.clients}/show/${id}`
    })
    const {data: genders} = useGetAllQuery({
        key: KEYS.genders, url: `${URLS.genders}/list`
    })
    const genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    const {data: residentTypes} = useGetAllQuery({
        key: KEYS.residentTypes, url: `${URLS.residentTypes}/list`
    })
    const residentTypeList = getSelectOptionsListFromData(get(residentTypes, `data.data`, []), '_id', 'name')

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
        enabled: !!(regionId || get(person, 'regionId'))
    })
    const districtList = getSelectOptionsListFromData(get(district, `data.data`, []), '_id', 'name')

    const {mutate: updateRequest, isLoading} = usePutQuery({listKeyId: KEYS.clients})

    const update = ({data}) => {
        updateRequest({
            url:`${ URLS.clients}/${id}`,
            attributes: {
                ...data,
                type: PERSON_TYPE.person,
            }
        }, {
            onSuccess: () => {
                navigate('/clients/physical')
            },
            onError: () => {

            }
        })
    }
    return (
        <>
            {(isLoading || isLoadingPersonalInfo) && <OverlayLoader/>}
            <Section>
                <Row className={'mb-25'}>
                    <Col xs={12}>
                        <Title>Client udate</Title>
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
                                            type={'button'}>Физ. лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={9} className={'text-right'}>
                                    <Flex justify={'flex-end'} align={'flex-start'}>
                                        <Field defaultValue={get(data,'data.person.passportData.seria')} params={{required: true}}
                                               className={'mr-16'} style={{width: 75}}
                                               property={{
                                                   hideErrorMsg: true,
                                                   hideLabel: true,
                                                   mask: 'aa',
                                                   placeholder: 'AA',
                                                   upperCase: true,
                                                   maskChar: '_',
                                                   onChange: (val) => setPassportSeries(upperCase(val))
                                               }}
                                               name={'person.passportData.seria'}
                                               type={'input-mask'}
                                        />
                                        <Field defaultValue={get(data,'data.person.passportData.number')} params={{required: true}} property={{
                                            hideErrorMsg: true,
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                            onChange: (val) => setPassportNumber(val)
                                        }} name={'person.passportData.number'} type={'input-mask'}/>

                                        <Field defaultValue={get(data,'data.person.birthDate')} params={{required: true}} className={'ml-15'}
                                               property={{
                                                   hideErrorMsg: true,
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                                   onChange: (e) => setBirthDate(e)
                                               }}
                                               name={'person.birthDate'} type={'datepicker'}/>
                                        <Button onClick={() => getInfo()} className={'ml-15'}
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
                            <Field   params={{required: true}}
                                   defaultValue={get(person, 'firstNameLatin',get(data,'data.person.fullName.firstname'))}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'person.fullName.firstname'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(person, 'lastNameLatin',get(data,'data.person.fullName.lastname'))}
                                   label={'Lastname'} type={'input'}
                                   name={'person.fullName.lastname'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(person, 'middleNameLatin',get(data,'data.person.fullName.middlename'))}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'person.fullName.middlename'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(head(get(person, 'documents', [])), 'datebegin',get(data,'data.person.passportData.startDate'))}
                                   label={'Дата выдачи паспорта'}
                                   type={'datepicker'}
                                   name={'person.passportData.startDate'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(head(get(person, 'documents', [])), 'docgiveplace',get(data,'data.person.passportData.issuedBy'))}
                                   label={'Кем выдан'}
                                   type={'input'}
                                   name={'person.passportData.issuedBy'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                fullWidth
                                params={{required: true}}
                                defaultValue={get(person, 'gender',get(data,'data.person.gender'))}
                                options={genderList}
                                label={'Gender'}
                                type={'select'}
                                name={'person.gender'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field defaultValue={get(person, 'pinfl',get(data,'data.person.passportData.pinfl'))} label={'ПИНФЛ'} type={'input-mask'} property={{
                                placeholder: 'ПИНФЛ',
                                mask: '99999999999999',
                                maskChar: '_'
                            }}
                                   name={'person.passportData.pinfl'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{
                                    required: true,
                                    pattern: {
                                        value: /^998[0-9]{9}$/,
                                        message: 'Invalid format'
                                    }
                                }}
                                defaultValue={get(person, 'phone',get(data,'data.person.phone'))}
                                label={'Phone'}
                                type={'input'}
                                property={{placeholder: '998XXXXXXXXX'}}
                                name={'person.phone'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(person, 'email',get(data,'data.person.email'))}
                                label={'Email'}
                                type={'input'}
                                name={'person.email'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={residentTypeList}
                                defaultValue={get(person, 'residentType',get(data,'data.person.residentType'))}
                                label={'Resident type'}
                                type={'select'}
                                name={'person.residentType'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(person, 'birthCountry', 210)}
                                label={'Country'}
                                type={'select'}
                                options={countryList}
                                name={'person.country'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={regionList}
                                defaultValue={get(person, 'regionId',get(data,'data.person.region'))}
                                label={'Region'}
                                type={'select'}
                                property={{
                                    onChange: (val) => setRegionId(val)
                                }}
                                name={'person.region'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                params={{required: true}}
                                options={districtList}
                                defaultValue={get(person, 'districtId',get(data,'data.person.district'))}
                                label={'District'}
                                type={'select'}
                                name={'person.district'}/>
                        </Col>
                        <Col xs={12} className={'mb-25'}>
                            <Field
                                noMaxWidth
                                params={{required: true}}
                                defaultValue={get(person, 'address',get(data,'data.person.address'))}
                                label={'Address'}
                                type={'input'}
                                name={'person.address'}/>
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
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default ClientUpdateContainer;