import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, isEqual, range, upperCase} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import dayjs from "dayjs";
import {PERSON_TYPE} from "../../../constants";

const ClientCreateContainer = ({...rest}) => {
    const navigate = useNavigate();
    const [insurant, setInsurant] = useState(PERSON_TYPE.person)
    const [insurantPerson, setInsurantPerson] = useState(null)
    const [insurantOrganization, setInsurantOrganization] = useState(null)
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
    const [inn, setInn] = useState(null)
    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})
    const {data: ownershipForms} = useGetAllQuery({
        key: KEYS.ownershipForms, url: URLS.ownershipForms
    })
    const ownershipFormList = getSelectOptionsListFromData(get(ownershipForms, `data.result`, []), 'id', 'name')
    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfoorganizationInfoProvider
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})



    const getInfo = () => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes:  {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setInsurantPerson(get(data, 'result'));
                }
            }
        )
    }
    const getOrgInfo = (type = 'owner') => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn: inn
                }
            },
            {
                onSuccess: ({data}) => {
                    setInsurantOrganization(get(data, 'result'))
                }
            }
        )
    }
    let {data: branches} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchname')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    let regionList = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')


    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: URLS.typeofpersons})
    persons = getSelectOptionsListFromData(get(persons, `data.data`, []), '_id', 'name')



    let {data: genders} = useGetAllQuery({key: KEYS.genders, url: URLS.genders})
    let genderList = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    let {data: citizenship} = useGetAllQuery({key: KEYS.citizenship, url: URLS.citizenship})
    citizenship = getSelectOptionsListFromData(get(citizenship, `data.data`, []), '_id', 'name')

    let {data: typeofdocuments} = useGetAllQuery({key: KEYS.typeofdocuments, url: URLS.typeofdocuments})
    typeofdocuments = getSelectOptionsListFromData(get(typeofdocuments, `data.data`, []), '_id', 'name')

    let {data: districts} = useGetAllQuery({key: KEYS.districts, url: URLS.districts})
    let districtList = getSelectOptionsListFromData(get(districts, `data.data`, []), '_id', 'name')

    let {data: positions} = useGetAllQuery({key: KEYS.position, url: URLS.position})
    positions = getSelectOptionsListFromData(get(positions, `data.data`, []), '_id', 'name')


    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.clients})
    const create = ({data}) => {
        createRequest({url: URLS.clients, attributes: {...data}}, {
            onSuccess: () => {
                navigate('/clients/juridical')
            },
            onError: () => {

            }
        })
    }
    return (
        <>
            {isLoading && <OverlayLoader/>}
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
                                        <Button onClick={() => setInsurant(PERSON_TYPE.person)}
                                                gray={!isEqual(insurant, PERSON_TYPE.person)} className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                        <Button onClick={() => setInsurant(PERSON_TYPE.organization)}
                                                gray={!isEqual(insurant, PERSON_TYPE.organization)} type={'button'}>Юр.
                                            лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={9} className={'text-right'}>
                                    {isEqual(insurant, PERSON_TYPE.person) && <Flex justify={'flex-end'} align={'flex-start'}>
                                        <Field params={{required: true}}
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
                                               name={'owner.person.passportData.seria'}
                                               type={'input-mask'}
                                        />
                                        <Field params={{required: true}} property={{
                                            hideErrorMsg: true,
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                            onChange: (val) => setPassportNumber(val)
                                        }} name={'owner.person.passportData.number'} type={'input-mask'}/>

                                        <Field params={{required: true}} className={'ml-15'}
                                               property={{
                                                   hideErrorMsg: true,
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                                   onChange: (e) => setBirthDate(e)
                                               }}
                                               name={'owner.person.birthDate'} type={'datepicker'}/>
                                        <Button onClick={() => getInfo()} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                    {isEqual(insurant, PERSON_TYPE.organization) && <Flex justify={'flex-end'} align={'flex-start'}>
                                        <Field params={{required: true}} property={{
                                            hideErrorMsg: true,
                                            hideLabel: true,
                                            mask: '999999999',
                                            placeholder: 'ИНН',
                                            maskChar: '_',
                                            onChange: (val) => setInn(val)
                                        }} name={'owner.organization.inn'} type={'input-mask'}/>

                                        <Button onClick={() => getOrgInfo()} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>
                        {isEqual(insurant, PERSON_TYPE.person) && <>
                            <Col xs={4} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(insurantPerson, 'firstNameLatin')}
                                       label={'Firstname'}
                                       type={'input'}
                                       name={'owner.person.fullName.firstname'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(insurantPerson, 'lastNameLatin')}
                                       label={'Lastname'} type={'input'}
                                       name={'owner.person.fullName.lastname'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(insurantPerson, 'middleNameLatin')}
                                       label={'Middlename'}
                                       type={'input'}
                                       name={'owner.person.fullName.middlename'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field defaultValue={get(insurantPerson, 'pinfl')} label={'ПИНФЛ'} type={'input'}
                                       name={'owner.person.passportData.pinfl'}/>
                            </Col>

                            <Col xs={4} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(insurantPerson, 'gender')}
                                       options={genderList}
                                       label={'Gender'}
                                       type={'select'}
                                       name={'owner.person.gender'}/>
                            </Col>

                            <Col xs={4} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={regionList}
                                    defaultValue={get(insurantPerson, 'regionId')}
                                    label={'Region'}
                                    type={'select'}
                                    name={'owner.person.regionId'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field
                                    params={{required: true}}
                                    options={districtList}
                                    defaultValue={get(insurantPerson, 'districtId')}
                                    label={'District'}
                                    type={'select'}
                                    name={'owner.person.districtId'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field params={{required: true}}
                                       defaultValue={get(insurantPerson, 'address')}
                                       label={'Address'}
                                       type={'input'}
                                       name={'owner.person.address'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field
                                    params={{
                                        required: true,
                                        pattern: {
                                            value: /^998(9[012345789]|6[125679]|7[01234569]|3[01234569])[0-9]{7}$/,
                                            message: 'Invalid format'
                                        }
                                    }}
                                    defaultValue={get(insurantPerson, 'phone')}
                                    label={'Phone'}
                                    type={'input'}
                                    property={{placeholder: '998XXXXXXXXX'}}
                                    name={'owner.person.phone'}/>
                            </Col>
                        </>}
                        {isEqual(insurant, PERSON_TYPE.organization) && <>
                            <Col xs={4}><Field defaultValue={130} label={'Форма собственности'}
                                               params={{required: true}}
                                               options={ownershipFormList}
                                               type={'select'}
                                               name={'owner.organization.ownershipFormId'}/></Col>
                            <Col xs={8} className={'mb-25'}>
                                <Field params={{required: true}} defaultValue={get(insurantOrganization, 'name')}
                                       label={'Наименование'} type={'input'}
                                       name={'owner.organization.name'}/>
                            </Col>


                            <Col xs={4}><Field label={'Область'} params={{required: true}} options={regionList}
                                               type={'select'}
                                               name={'owner.organization.regionId'}/></Col>
                            <Col xs={4}><Field label={'Район'} params={{required: true}} options={districtList}
                                               type={'select'}
                                               name={'owner.organization.districtId'}/></Col>

                            <Col xs={4} className={'mb-25'}>
                                <Field defaultValue={get(insurantOrganization, 'address')} params={{required: true}}
                                       label={'Address'} type={'input'}
                                       name={'owner.organization.address'}/>
                            </Col>
                            <Col xs={4} className={'mb-25'}>
                                <Field defaultValue={get(insurantOrganization, 'phone')} params={{
                                    required: true,
                                    pattern: /^998(9[012345789]|6[125679]|7[01234569]|3[01234569])[0-9]{7}$/
                                }}
                                       label={'Телефон'} type={'input'}
                                       name={'owner.organization.phone'}/>
                            </Col>

                        </>}
                    </Row>

                </Form>
            </Section>
        </>
    );
};

export default ClientCreateContainer;