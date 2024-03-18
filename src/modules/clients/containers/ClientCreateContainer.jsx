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
import {Minus, Plus} from "react-feather";
import Flex from "../../../components/flex";

const ClientCreateContainer = ({...rest}) => {
    const navigate = useNavigate();

    const [personType, setPersonType] = useState(null)
    const [empCount, setEmpCount] = useState(0);
    const [insurant, setInsurant] = useState('organization')
    const [passportSeries, setInsurantPassportSeries] = useState(null)
    const [insurantPassportNumber, setInsurantPassportNumber] = useState(null)
    const [insurantBirthDate, setInsurantBirthDate] = useState(null)
    const {
        mutate: getPersonalInfoRequest, isLoading: isLoadingPersonalInfo
    } = usePostQuery({listKeyId: KEYS.personalInfoProvider})
    const setPersonTypeForSelect = (val, name) => {
        if (isEqual(name, 'typeofpersons')) {
            setPersonType(val)
        }
    }
    const getInfo = (type = 'owner') => {
        getPersonalInfoRequest({
                url: URLS.personalInfoProvider, attributes: type == 'insurant' ? {
                    birthDate: dayjs(insurantBirthDate).format('YYYY-MM-DD'),
                    passportSeries: insurantPassportSeries,
                    passportNumber: insurantPassportNumber
                } : {
                    birthDate: dayjs(birthDate).format('YYYY-MM-DD'), passportSeries, passportNumber
                }
            },
            {
                onSuccess: ({data}) => {
                    setOwnerPerson(get(data, 'result'));
                }
            }
        )
    }
    let {data: branches} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    branches = getSelectOptionsListFromData(get(branches, `data.data`, []), '_id', 'branchname')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    regions = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')


    let {data: persons} = useGetAllQuery({key: KEYS.typeofpersons, url: URLS.typeofpersons})
    persons = getSelectOptionsListFromData(get(persons, `data.data`, []), '_id', 'name')



    let {data: genders} = useGetAllQuery({key: KEYS.genders, url: URLS.genders})
    genders = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')

    let {data: citizenship} = useGetAllQuery({key: KEYS.citizenship, url: URLS.citizenship})
    citizenship = getSelectOptionsListFromData(get(citizenship, `data.data`, []), '_id', 'name')

    let {data: typeofdocuments} = useGetAllQuery({key: KEYS.typeofdocuments, url: URLS.typeofdocuments})
    typeofdocuments = getSelectOptionsListFromData(get(typeofdocuments, `data.data`, []), '_id', 'name')

    let {data: districts} = useGetAllQuery({key: KEYS.districts, url: URLS.districts})
    districts = getSelectOptionsListFromData(get(districts, `data.data`, []), '_id', 'name')

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
                <Form getValueFromField={(val, name) => setPersonTypeForSelect(val, name)}
                      footer={<Button>Save</Button>} formRequest={(values) => create(values)}>
                    <Row gutterWidth={60} className={'mt-15'}>
                        <Col xs={12} className={'mb-25'}><Title>Информация о страхователе:
                        </Title></Col>
                        <Col xs={12}>
                            <Row>
                                <Col xs={4}>
                                    <Flex>
                                        <h4 className={'mr-16'}>Страхователь</h4>
                                        <Button onClick={() => setInsurant('person')}
                                                gray={!isEqual(insurant, 'person')} className={'mr-16'}
                                                type={'button'}>Физ. лицо</Button>
                                        <Button onClick={() => setInsurant('organization')}
                                                gray={!isEqual(insurant, 'organization')} type={'button'}>Юр.
                                            лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={8} className={'text-right'}>
                                    {isEqual(insurant, 'person') && <Flex justify={'flex-end'}>
                                        <Field params={{required: true}}
                                               className={'mr-16'} style={{width: 75}}
                                               property={{
                                                   hideErrorMsg: true,
                                                   hideLabel: true,
                                                   mask: 'aa',
                                                   placeholder: 'AA',
                                                   upperCase: true,
                                                   maskChar: '_',
                                                   onChange: (val) => setInsurantPassportSeries(upperCase(val))
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
                                            onChange: (val) => setInsurantPassportNumber(val)
                                        }} name={'owner.person.passportData.number'} type={'input-mask'}/>

                                        <Field params={{required: true}} className={'ml-15'}
                                               property={{
                                                   hideErrorMsg: true,
                                                   hideLabel: true,
                                                   placeholder: 'Дата рождения',
                                                   onChange: (e) => setInsurantBirthDate(e)
                                               }}
                                               name={'owner.person.birthDate'} type={'datepicker'}/>
                                        <Button onClick={() => getInfo('insurant')} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                    {isEqual(insurant, 'organization') && <Flex justify={'flex-end'}>
                                        <Field params={{required: true}} property={{
                                            hideErrorMsg: true,
                                            hideLabel: true,
                                            mask: '999999999',
                                            placeholder: 'ИНН',
                                            maskChar: '_',
                                            onChange: (val) => setInsurantInn(val)
                                        }} name={'owner.organization.inn'} type={'input-mask'}/>

                                        <Button onClick={() => getOrgInfo('insurant')} className={'ml-15'}
                                                type={'button'}>Получить
                                            данные</Button>
                                    </Flex>}
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12}>
                            <hr className={'mt-15 mb-15'}/>
                        </Col>
                        {isEqual(insurant, 'person') && <>
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
                        {isEqual(insurant, 'organization') && <>
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
                    <Row>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Branch'} options={branches}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={'INN'}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{required: true, pattern: /^[0-9]*$/}}/>
                        </Col>

                        <Col xs={4}>
                            <Field name={'typeofpersons'} type={'select'} label={'Person type'} options={persons}
                                   params={{required: true}}/>
                        </Col>
                        {isEqual(personType, '6292025f8982798b6996bc34') && <>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.name'} type={'input'} label={'name'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.secondname'} type={'input'} label={'secondname'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.middlename'} type={'input'} label={'middlename'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.gender'} type={'select'} label={'Gender'}
                                       options={genders}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.dateofbirth'} dateFormat={"MM/DD/YYYY"}
                                       type={'datepicker'}
                                       label={'dateofbirth'}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.citizenship'} type={'select'} label={'Citizenship'}
                                       options={citizenship}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.typeofdocument'} type={'select'}
                                       label={'typeofdocument'} options={typeofdocuments}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportSeries'} type={'input-mask'}
                                       label={'Passport seria'}
                                       property={{mask: 'aa', maskChar: '_'}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportNumber'} type={'input-mask'}
                                       label={'Passport number'}
                                       property={{mask: '9999999', maskChar: '_'}}
                                />
                            </Col>
                            <Col xs={4}>

                                <Field name={'forindividualsdata.pin'} type={'input-mask'} label={'PINFL'}
                                       property={{mask: '99999999999999', maskChar: '_'}}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuancedate'} dateFormat={"MM/DD/YYYY"}
                                       type={'datepicker'}
                                       label={'passportissuancedate'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.passportissuedby'} type={'input'}
                                       label={'passportissuedby'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.regions'} type={'select'} label={'Region'}
                                       options={regions}
                                       params={{required: true}}/>
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.districts'} type={'select'} label={'District'}
                                       options={districts}
                                       params={{required: true}}/>
                            </Col>

                            <Col xs={4}>
                                <Field name={'forindividualsdata.address'} type={'input'}
                                       label={'address'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.postcode'} type={'input'}
                                       label={'postcode'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.telephonenumber'} type={'input'}
                                       label={'telephonenumber'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.emailforcontact'} type={'input'}
                                       label={'emailforcontact'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.personalaccount'} type={'input'}
                                       label={'personalaccount'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.transitaccount'} type={'input'}
                                       label={'transitaccount'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.mfo'} type={'input'}
                                       label={'mfo'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.nameofbank'} type={'input'}
                                       label={'nameofbank'}
                                />
                            </Col>
                            <Col xs={4}>
                                <Field name={'forindividualsdata.numberofcard'} type={'input'} label={'numberofcard'}
                                />
                            </Col>
                        </>
                        }
                        {isEqual(personType, '629202448982798b6996bc32') &&
                            <>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.nameoforganization'} type={'input'}
                                           label={'nameoforganization'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.oked'} type={'input'} label={'oked'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.mfo'} type={'input'} label={'mfo'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.nameofbank'} type={'input'} label={'nameofbank'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.innofbank'} type={'input'} label={'innofbank'}
                                    />
                                </Col>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.scheduledaccount'} type={'input'}
                                           label={'scheduledaccount'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.region'} type={'select'} label={'Region'}
                                           options={regions}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.districts'} type={'select'} label={'District'}
                                           options={districts}
                                           params={{required: true}}/>
                                </Col>

                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.address'} type={'input'}
                                           label={'address'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.postcode'} type={'input'}
                                           label={'postcode'}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Field name={'corporateentitiesdata.checkingaccount'} type={'input'}
                                           label={'checkingaccount'}
                                    />
                                </Col>
                                <Col xs={11} className={"mb-15"}>
                                    <Title sm>Add employee</Title>
                                </Col>
                                <Col xs={1} className={'text-right'}>
                                    <Button onClick={() => setEmpCount(prev => ++prev)} sm type={"button"}
                                            inline><Plus/></Button>
                                </Col>
                                {range(0, empCount).map(count => <Col xs={12} className={'box__outlined'}><Row
                                    align={"center"}>
                                    <Col xs={11}>
                                        <Row>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].fullname`}
                                                       type={'input'}
                                                       label={'Employee fullname'}
                                                       params={{required: true}}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].positions`}
                                                       type={'select'} options={positions}
                                                       label={'Employee position'}
                                                       params={{required: true}}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field
                                                    name={`corporateentitiesdata.employees[${count}].typeofdocumentsformanager`}
                                                    type={'select'} options={typeofdocuments}
                                                    label={'Employee doc type'}
                                                    params={{required: true}}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].documentnumber`}
                                                       type={'input'}
                                                       label={'Employee documentnumber'}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field
                                                    name={`corporateentitiesdata.employees[${count}].dateofmanagerdocument`}
                                                    dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                    label={'dateofmanagerdocument'}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field name={`corporateentitiesdata.employees[${count}].expirationdate`}
                                                       dateFormat={"MM/DD/YYYY"} type={'datepicker'}
                                                       label={'expirationdate'}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field
                                                    name={`corporateentitiesdata.employees[${count}].telephonenumber`}
                                                    type={'input'}
                                                    label={'telephonenumber'}
                                                />
                                            </Col>
                                            <Col xs={4}>
                                                <Field
                                                    name={`corporateentitiesdata.employees[${count}].emailforcontacts`}
                                                    type={'input'}
                                                    label={'emailforcontacts'}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={1} className={"text-right "}>
                                        <Button danger onClick={() => setEmpCount(prev => --prev)} sm type={"button"}
                                                inline><Minus/></Button>
                                    </Col>
                                </Row></Col>)}

                            </>
                        }
                        <Col xs={4}>
                            <Field
                                label={'isUsedourpanel'}
                                type={'switch'}
                                name={'isUsedourpanel'}
                                params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field
                                label={'isUserRestAPI'}
                                type={'switch'}
                                name={'isUserRestAPI'}
                                params={{required: true}}/>
                        </Col>

                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default ClientCreateContainer;