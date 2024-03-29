import React, {useState, useMemo, useCallback} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {every, get, includes, isEmpty, isEqual, isNil, setWith, some} from "lodash"
import Title from "../../../../components/ui/title";
import {useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import Table from "../../../../components/table";
import Flex from "../../../../components/flex";
import {Trash2} from "react-feather";
import {toast} from "react-toastify";

const StepFour = ({id = null, ...props}) => {
    const [fields, setFields] = useState({riskOptions: []})
    const [otherParams, setOtherParams] = useState({})
    const [tarif, setTarif] = useState({})
    const [tariffList, setTariffList] = useState([])
    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))
    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const product = useSettingsStore(state => get(state, 'product', {}))

    const nextStep = ({data}) => {
        let {riskOptions, agentlist, Isagreement, limitofagreement, tariffperclasses, ...rest} = data;
        setProduct({...rest});
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

    let {data: agents} = useGetAllQuery({key: ['agents-list'], url: `${URLS.clients}/list`})
    agents = getSelectOptionsListFromData(get(agents, `data`, []), '_id', ['person.fullName.lastname','person.fullName.firstname','organization.name'])


    let {data: classes} = useGetAllQuery({key: KEYS.classes, url: `${URLS.insuranceClass}/list`})
    const classOptions = getSelectOptionsListFromData(get(classes, `data`, []), '_id', 'name')

    let {data: risks} = useGetAllQuery({key: KEYS.risk, url: `${URLS.risk}/list`})
    let risksOptions = getSelectOptionsListFromData(get(risks, `data`, []), '_id', 'name')

    let {data: franchises} = useGetAllQuery({key: KEYS.typeoffranchise, url: `${URLS.typeoffranchise}/list`})
    franchises = getSelectOptionsListFromData(get(franchises, `data`, []), '_id', 'name')

    let {data: baseFranchises} = useGetAllQuery({key: KEYS.baseoffranchise, url: `${URLS.baseoffranchise}/list`})
    baseFranchises = getSelectOptionsListFromData(get(baseFranchises, `data`, []), '_id', 'name')


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
        return list.find(l => isEqual(get(l, "_id"), id))
    }


    const addTariff = () => {
        let result = [];
        let {...rest} = tarif;
        if (!isNil(get(tarif, "tariff[0].agent"))) {
            const res = tariffList.filter(t => !isEqual(get(t, "tariff[0].agent"), get(rest, "tariff[0].agent")));
            result = [...res, rest]
            setTariffList(result)
            setTarif({
                ...tarif,
                tariffPerClass: get(tarif, 'tariff.tariffPerClass', []).map(({class:classes, min, max}) => ({
                    classes,
                    min: 0,
                    max: 0
                }))
            })
        } else {
            toast.warn("Select all fields")
        }

    }

    const removeTariffFromList = (i) => {
        setTariffList(prev => prev.filter((f, j) => !isEqual(i, j)))
    }
    console.log('tariffList',tariffList)
    console.log('otherParams',otherParams)
    console.log('tarif',tarif)

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
                                    <Field label={'Агенты'}
                                           type={'select'}
                                           name={'tariff[0].agent'}
                                           options={agents}
                                           defaultValue={get(product, 'tariff[0].agent')}
                                           params={{required: get(product, 'riskData', []).length > 0}}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Разрешить заключение договоров'}
                                           type={'switch'}
                                           name={'tariff[0].allowAgreement'}
                                           defaultValue={get(product, 'tariff[0].allowAgreement', false)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Лимит ответственности'}
                                           type={'number-format-input'}
                                           name={'tariff[0].limitOfAgreement'}
                                           defaultValue={get(product, 'tariff[0].limitOfAgreement', 0)}
                                           property={{placeholder: 'Введите значение'}}
                                    />
                                </Col>
                                <Col xs={3} className={'text-right'}>
                                    <Button onClick={addTariff} type={'button'} className={'mb-25'}>Применить</Button>
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
                                            name={`tariff[0].tariffPerClass[${i}].class`}
                                            type={'select'}
                                            property={{
                                                hideLabel: true,
                                                bgColor: get(findItem(get(classes, 'data'), get(item, "_id")), 'color')
                                            }}
                                            options={classOptions}
                                            defaultValue={get(findItem(get(classes, 'data'), get(item, "classeId")), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`tariff[0].tariffPerClass[${i}].min`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Мин', suffix: ' %'}}
                                                defaultValue={get(product, `tariff[0].tariffPerClass[${i}].min`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`tariff[0].tariffPerClass[${i}].max`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Макс', suffix: ' %'}}
                                                defaultValue={get(product, `tariff[0].tariffPerClass[${i}].max`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                </tr>)}
                            </Table>
                        </Col>}
                        {tariffList.length > 0 && <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Агент', 'Class', 'Разрешить заключение договоров', 'Лимит ответственности', 'Max', 'Min', 'Delete']}>
                                {tariffList.map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field options={agents} type={'select'} name={`tariff[${i}].agent`}
                                               defaultValue={get(item, 'tariff[0].agent')} property={{hideLabel: true}}
                                               isDisabled={true}/>
                                    </td>
                                    <td>
                                        {
                                            get(item, 'tariff[0].tariffPerClass', []).map((c, j) => <Field key={j}
                                                                                                 className={'mb-15'}
                                                                                                 name={`tariff[${i}].tariffPerClass[${j}].class`}
                                                                                                 type={'select'}
                                                                                                 property={{
                                                                                                     hideLabel: true,
                                                                                                     bgColor: get(findItem(get(classes, 'data'), get(c, "_id")), 'color')
                                                                                                 }}
                                                                                                 options={classOptions}
                                                                                                 defaultValue={get(findItem(get(classes, 'data'), get(c, "classes")), '_id')}
                                                                                                 isDisabled={true}
                                            />)

                                        }
                                    </td>
                                    <td>
                                        <Field property={{hideLabel: true}}
                                               type={'switch'}
                                               name={`tariff[${i}].allowAgreement`}
                                               defaultValue={get(item, 'allowAgreement', false)}
                                               disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'number-format-input'}
                                            name={`tariff[${i}].limitOfAgreement`}
                                            defaultValue={get(item, 'limitOfAgreement', 0)}
                                            property={{
                                                disabled: true,
                                                placeholder: 'Введите значение',
                                                hideLabel: true
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {get(item, `tariffPerClass`, []).map((c, j) => <Field key={j}
                                                                                              className={'mb-15'}
                                                                                              type={'number-format-input'}
                                                                                              name={`tariff[${i}].tariffPerClass[${j}].max`}
                                                                                              defaultValue={get(c, 'max', 0)}
                                                                                              property={{
                                                                                                  disabled: true,
                                                                                                  placeholder: 'Введите значение',
                                                                                                  hideLabel: true
                                                                                              }}
                                        />)}

                                    </td>
                                    <td>
                                        {get(item, `tariffPerClass`, []).map((c, j) => <Field key={j}
                                                                                              className={'mb-15'}
                                                                                              type={'number-format-input'}
                                                                                              name={`tariff[${i}].tariffPerClass[${j}].min`}
                                                                                              defaultValue={get(c, 'min', 0)}
                                                                                              property={{
                                                                                                  disabled: true,
                                                                                                  placeholder: 'Введите значение',
                                                                                                  hideLabel: true
                                                                                              }}
                                        />)}

                                    </td>
                                    <td className={'cursor-pointer'}
                                        onClick={() => removeTariffFromList(i)}><Trash2
                                        color={'#dc2626'}/></td>
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
                                            defaultValue={get(findItem(get(risks, 'data', []), get(item, 'risk')), '_id')}
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
                                                defaultValue={get(product, `franchise[${i}].isFixed`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseType`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                params={{required:true}}
                                                options={franchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].hasFranchise`))}
                                                defaultValue={get(product, `franchise[${i}].hasFranchise`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].franchiseBase`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                params={{required:true}}
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