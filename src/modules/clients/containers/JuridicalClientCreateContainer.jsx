import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, upperCase} from "lodash";
import {usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import Flex from "../../../components/flex";
import dayjs from "dayjs";
import {PERSON_TYPE} from "../../../constants";

const JuridicalClientCreateContainer = ({...rest}) => {
    const navigate = useNavigate();
    const [person, setPerson] = useState(null)
    const [passportSeries, setPassportSeries] = useState(null)
    const [passportNumber, setPassportNumber] = useState(null)
    const [birthDate, setBirthDate] = useState(null)
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


    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.clients})
    const create = ({data}) => {
        const {person: {seria, number, ...restPerson} = {}, ...rest} = data
        createRequest({
            url: URLS.clients,
            attributes: {
                ...rest,
                type: PERSON_TYPE.person,
                person: {...restPerson, passportNumber: `${seria}${number}`}
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
                                            type={'button'}>Физ. лицо</Button>
                                    </Flex>
                                </Col>
                                <Col xs={9} className={'text-right'}>
                                    <Flex justify={'flex-end'} align={'flex-start'}>
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
                                               name={'person.seria'}
                                               type={'input-mask'}
                                        />
                                        <Field params={{required: true}} property={{
                                            hideErrorMsg: true,
                                            hideLabel: true,
                                            mask: '9999999',
                                            placeholder: '1234567',
                                            maskChar: '_',
                                            onChange: (val) => setPassportNumber(val)
                                        }} name={'person.number'} type={'input-mask'}/>

                                        <Field params={{required: true}} className={'ml-15'}
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
                            <Field params={{required: true}}
                                   defaultValue={get(person, 'firstNameLatin')}
                                   label={'Firstname'}
                                   type={'input'}
                                   name={'person.firstName'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}} defaultValue={get(person, 'lastNameLatin')}
                                   label={'Lastname'} type={'input'}
                                   name={'person.lastName'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field params={{required: true}}
                                   defaultValue={get(person, 'middleNameLatin')}
                                   label={'Middlename'}
                                   type={'input'}
                                   name={'person.middleName'}/>
                        </Col>
                        <Col xs={4} params={{required: true}} className={'mb-25'}>
                            <Field defaultValue={get(person, 'pinfl')} label={'ПИНФЛ'} type={'input-mask'} property={{
                                placeholder: 'ПИНФЛ',
                                mask: '99999999999999',
                                maskChar: '_'
                            }}
                                   name={'person.personalIdentificationNumber'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(person, 'cardNumber')}
                                label={'Card number'}
                                type={'input'}
                                name={'person.cardNumber'}/>
                        </Col>
                        <Col xs={4} className={'mb-25'}>
                            <Field
                                defaultValue={get(person, 'personalAccount')}
                                label={'Personal account'}
                                type={'input'}
                                name={'person.personalAccount'}/>
                        </Col>
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default JuridicalClientCreateContainer;