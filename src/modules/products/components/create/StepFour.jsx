import React, {useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes, find, isEqual, setWith} from "lodash"
import Title from "../../../../components/ui/title";
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Table from "../../../../components/table";
import Flex from "../../../../components/flex";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'

const StepFour = ({id = null, ...props}) => {
    const reactQuillRef = React.useRef();
    const [fields, setFields] = useState({riskOptions: []})
    const [otherParams, setOtherParams] = useState({})
    const [tarif, setTarif] = useState({})
    const [comment, setComment] = useState('');
    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const product = useSettingsStore(state => get(state, 'product', {}))

    const nextStep = ({data}) => {
        let {riskOptions, agentlist, Isagreement, limitofagreement, tariffperclasses, ...rest} = data;
        setProduct({riskComment:comment,...rest});
        props.nextStep();
    }

    const prevStep = () => {
        props.previousStep();
    }

    const reset = () => {
        resetProduct();
        resetRiskList();
        props.firstStep();
    }

    let {data: agents} = useGetAllQuery({key: ['agents-list'], url: `${URLS.agents}/list`})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', ['organization.nameoforganization', 'person.secondname', 'person.name'])


    let {data: classes} = useGetAllQuery({key: KEYS.classes, url: `${URLS.insuranceClass}/list`})
    const classOptions = getSelectOptionsListFromData(get(classes, `data.data`, []), '_id', 'name')

    let {data: risks} = useGetAllQuery({key: KEYS.risk, url: `${URLS.risk}/list`})
    let risksOptions = getSelectOptionsListFromData(get(risks, `data.data`, []), '_id', 'name')

    let {data: franchises} = useGetAllQuery({key: KEYS.typeoffranchise, url: `${URLS.typeoffranchise}/list`})
    franchises = getSelectOptionsListFromData(get(franchises, `data.data`, []), '_id', 'name')

    let {data: baseFranchises} = useGetAllQuery({key: KEYS.baseoffranchise, url: `${URLS.baseoffranchise}/list`})
    baseFranchises = getSelectOptionsListFromData(get(baseFranchises, `data.data`, []), '_id', 'name')


    const setFieldValue = (value, name = "") => {

        if (includes('franchise[0].risk', name) || includes(name, 'franchise')) {
            setFields(prev => ({...prev, [name]: value}));
        }

        if (includes(['tariff[0].agent', 'tariff[0].allowAgreement', 'tariff[0].limitOfAgreement'], name)) {
            setTarif(prev => ({...prev, [name]: value}))
        }

        if (includes(name, 'tariff[0].tariffPerClass')) {
            setTarif(({...setWith(tarif, name, value)}))
        }
        setOtherParams(prev => ({...prev, [name]: value}))
    }


    const findItem = (list = [], id = null) => {
        return find(list, l => isEqual(get(l, "_id"), id))
    }



    return (
        <Row>
            <Col xs={12}>
                <StepNav step={4}/>
            </Col>
            <Col xs={12}>
                <Form formRequest={nextStep} getValueFromField={setFieldValue}>
                    <Row className={'mb-15'}>
                        <Col xs={12}>
                            <Title>Тарифы</Title>
                        </Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}>
                            <Row align={'flex-end'}>
                                <Col xs={3}>
                                    <Field label={'Разрешить заключение договоров'}
                                           type={'switch'}
                                           name={'tariff.allowAgreement'}
                                           defaultValue={get(product, 'tariff.allowAgreement', false)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Лимит ответственности'}
                                           type={'number-format-input'}
                                           name={'tariff.limitOfAgreement'}
                                           defaultValue={get(product, 'tariff.limitOfAgreement', 0)}
                                           property={{placeholder: 'Введите значение'}}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        {get(product, 'riskData', []).length > 0 && <Col xs={12} className={'mb-25'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Класс', 'минимальную и  ставку по классу ', 'максимальную ставку по классу',]}>
                                {get(product, 'riskData', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            name={`tariff.tariffPerClass[${i}].class`}
                                            type={'select'}
                                            property={{
                                                hideLabel: true,
                                                bgColor: get(findItem(get(classes, 'data.data'), get(item, "_id")), 'color')
                                            }}
                                            options={classOptions}
                                            defaultValue={get(findItem(get(classes, 'data.data'), get(item, "classeId")), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`tariff.tariffPerClass[${i}].min`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Мин', suffix: ' %'}}
                                                defaultValue={get(product, `tariff.tariffPerClass[${i}].min`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`tariff.tariffPerClass[${i}].max`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Макс', suffix: ' %'}}
                                                defaultValue={get(product, `tariff.tariffPerClass[${i}].max`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>Франшиза</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        {get(product, 'risk', []).length > 0 && <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Страховой риск', 'Имеет франшизу', 'Строго фиксирована', 'Введите фиксированное значение', 'Укажите тип франшизы', 'Укажите базу франшизы', 'Франшиза']}>
                                {get(product, 'riskData', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`franchise[${i}].risk`}
                                            type={'select'}
                                            property={{hideLabel: true}}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data', []), get(item, 'risk')), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].hasFranchise`}
                                                defaultValue={get(product, `franchise[${i}].hasFranchise`, false)}
                                                property={{hideLabel: true}}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].isFixed`}
                                                defaultValue={get(product, `franchise[${i}].isFixed`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!get(otherParams, `franchise[${i}].hasFranchise`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`franchise[${i}].fixedValue`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    disabled: !!!(get(fields, `franchise[${i}].isFixed`))
                                                }}
                                                defaultValue={get(product, `franchise[${i}].fixedValue`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseType`}
                                                type={'select'}
                                                property={{hideLabel: true, hideErrorMsg: true}}
                                                options={franchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(product, `franchise[${i}].franchiseType`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseBase`}
                                                type={'select'}
                                                property={{hideLabel: true, hideErrorMsg: true}}
                                                options={baseFranchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(product, `franchise[${i}].franchiseBase`)}
                                            />
                                        </Flex>
                                    </td>

                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field

                                                name={`franchise[${i}].franchise`}
                                                type={'input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'Введите значение',
                                                    disabled: !(get(otherParams, `franchise[${i}].hasFranchise`) && !get(otherParams, `franchise[${i}].isFixed`))
                                                }}
                                                defaultValue={get(product, `franchise[${i}].franchise`, '')}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}><Title>Комментарий о риске</Title></Col>
                    </Row>
                    <Row className={'mb-25'}>
                        <Col xs={12}>
                            <ReactQuill style={{height: 250}} theme="snow" value={comment} onChange={setComment}
                                        ref={reactQuillRef}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className={'mt-32'}>
                            <Button className={'mr-16'} type={'button'} onClick={reset} danger outlined
                                    back>Отменить</Button>
                            <Button dark className={'mr-16'} type={'button'} onClick={prevStep}
                                    outlined>Назад</Button>
                            <Button type={'submit'} success>Продолжить</Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default StepFour;
