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
    const [tarif, setTarif] = useState({
        agentlist: null,
        limitofagreement: 0,
        Isagreement: false,
        tariffperclasses: []
    })
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

    let {data: agents} = useGetAllQuery({key: KEYS.agents, url: URLS.agents})
    agents = getSelectOptionsListFromData(get(agents, `data.data`, []), '_id', 'inn')

    let {data: classes} = useGetAllQuery({key: KEYS.classes, url: URLS.classes})
    const classOptions = getSelectOptionsListFromData(get(classes, `data.data`, []), '_id', 'name')

    let {data: risks} = useGetAllQuery({key: KEYS.risk, url: URLS.risk})
    let risksOptions = getSelectOptionsListFromData(get(risks, `data.data`, []), '_id', 'name')

    let {data: franchises} = useGetAllQuery({key: KEYS.typeoffranchise, url: URLS.typeoffranchise})
    franchises = getSelectOptionsListFromData(get(franchises, `data.data`, []), '_id', 'name')

    let {data: baseFranchises} = useGetAllQuery({key: KEYS.baseoffranchise, url: URLS.baseoffranchise})
    baseFranchises = getSelectOptionsListFromData(get(baseFranchises, `data.data`, []), '_id', 'name')


    const setFieldValue = (value, name = "") => {

        if (includes('riskOptions', name) || includes(name, 'franchise')) {
            setFields(prev => ({...prev, [name]: value}));
        }

        if (includes(['agentlist', 'Isagreement', 'limitofagreement'], name)) {
            setTarif(prev => ({...prev, [name]: value}))
        }

        if (includes(name, 'tariffperclasses')) {
            setTarif(({...setWith(tarif, name, value)}))
        }
    }


    const findItem = (list = [], id = null) => {
        return list.find(l => isEqual(get(l, "_id"), id))
    }


    const addTariff = () => {
        let result = [];
        let {tariff, ...rest} = tarif;
        if (!isNil(get(tarif, "agentlist"))) {
            const res = tariffList.filter(t => !isEqual(get(t, "agentlist"), get(rest, "agentlist")));
            result = [...res, rest]
            setTariffList(result)
            setTarif({
                ...tarif,
                tariffperclasses: get(tarif, 'tariffperclasses', []).map(({classes, min, max}) => ({
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
                                           name={'agentlist'}
                                           options={agents}
                                           defaultValue={get(product, 'agentlist')}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Разрешить заключение договоров'}
                                           type={'switch'}
                                           name={'Isagreement'}
                                           defaultValue={get(product, 'Isagreement', false)}
                                    />
                                </Col>
                                <Col xs={3}>
                                    <Field label={'Лимит ответственности'}
                                           type={'number-format-input'}
                                           name={'limitofagreement'}
                                           defaultValue={get(product, 'limitofagreement', 0)}
                                           property={{placeholder: 'Введите значение'}}
                                    />
                                </Col>
                                <Col xs={3} className={'text-right'}>
                                    <Button onClick={addTariff} type={'button'} className={'mb-25'}>Применить</Button>
                                </Col>
                            </Row>
                        </Col>
                        {get(product, 'riskId', []).length > 0 && <Col xs={12} className={'mb-25'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Класс', 'минимальную и  ставку по классу ', 'максимальную ставку по классу',]}>
                                {get(product, 'riskId', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            name={`tariffperclasses[${i}].classes`}
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
                                                name={`tariffperclasses[${i}].min`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Мин', suffix: ' %'}}
                                                defaultValue={get(product, `tariffperclasses[${i}].min`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'flex-end'}>
                                            <Field
                                                name={`tariffperclasses[${i}].max`}
                                                type={'number-format-input'}
                                                property={{hideLabel: true, placeholder: 'Макс', suffix: ' %'}}
                                                defaultValue={get(product, `tariffperclasses[${i}].max`, 0)}
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
                                        <Field options={agents} type={'select'} name={`tariff[${i}].agentlist`}
                                               defaultValue={get(item, 'agentlist')} property={{hideLabel: true}}
                                               isDisabled={true}/>
                                    </td>
                                    <td>
                                        {
                                            get(item, 'tariffperclasses', []).map((c, j) => <Field key={j}
                                                                                                   className={'mb-15'}
                                                                                                   name={`tariff[${i}].tariffperclasses[${j}].classes`}
                                                                                                   type={'select'}
                                                                                                   property={{
                                                                                                       hideLabel: true,
                                                                                                       bgColor: get(findItem(get(classes, 'data.data'), get(c, "_id")), 'color')
                                                                                                   }}
                                                                                                   options={classOptions}
                                                                                                   defaultValue={get(findItem(get(classes, 'data.data'), get(c, "classes")), '_id')}
                                                                                                   isDisabled={true}
                                            />)

                                        }
                                    </td>
                                    <td>
                                        <Field property={{hideLabel: true}}
                                               type={'switch'}
                                               name={`tariff[${i}].Isagreement`}
                                               defaultValue={get(item, 'Isagreement', false)}
                                               disabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={'number-format-input'}
                                            name={`tariff[${i}].limitofagreement`}
                                            defaultValue={get(item, 'limitofagreement', 0)}
                                            property={{
                                                disabled: true,
                                                placeholder: 'Введите значение',
                                                hideLabel: true
                                            }}
                                        />
                                    </td>
                                    <td>
                                        {get(item, `tariffperclasses`, []).map((c, j) => <Field key={j}
                                                                                                className={'mb-15'}
                                                                                                type={'number-format-input'}
                                                                                                name={`tariff[${i}].tariffperclasses[${j}].max`}
                                                                                                defaultValue={get(c, 'max', 0)}
                                                                                                property={{
                                                                                                    disabled: true,
                                                                                                    placeholder: 'Введите значение',
                                                                                                    hideLabel: true
                                                                                                }}
                                        />)}

                                    </td>
                                    <td>
                                        {get(item, `tariffperclasses`, []).map((c, j) => <Field key={j}
                                                                                                className={'mb-15'}
                                                                                                type={'number-format-input'}
                                                                                                name={`tariff[${i}].tariffperclasses[${j}].min`}
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
                        {get(product, 'riskId', []).length > 0 && <Col xs={12} className={'horizontal-scroll'}>
                            <hr/>
                            <Table hideThead={false}
                                   thead={['Страховой риск', 'Имеет франшизу', 'Строго фиксирована', 'Введите фиксированное значение', 'Укажите тип франшизы', 'Укажите базу франшизы', 'Франшиза']}>
                                {get(product, 'riskId', []).map((item, i) => <tr key={i + 1}>
                                    <td>
                                        <Field
                                            className={'w-250'}
                                            name={`franchise[${i}].risk`}
                                            type={'select'}
                                            property={{hideLabel: true}}
                                            options={risksOptions}
                                            defaultValue={get(findItem(get(risks, 'data.data'), get(item, 'risk')), '_id')}
                                            isDisabled={true}
                                        />
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].Isfranchise`}
                                                defaultValue={get(product, `franchise[${i}].Isfranchise`, false)}
                                                property={{hideLabel: true}}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                type={'switch'}
                                                name={`franchise[${i}].Isfixedfranchise`}
                                                defaultValue={get(product, `franchise[${i}].Isfixedfranchise`, false)}
                                                property={{hideLabel: true}}
                                                disabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                            />
                                        </Flex>
                                    </td>
                                    <td>
                                        <Flex justify={'center'}>
                                            <Field
                                                name={`franchise[${i}].fixedvalue`}
                                                type={'number-format-input'}
                                                property={{
                                                    hideLabel: true,
                                                    placeholder: 'ввод значения',
                                                    disabled: !!!(get(fields, `franchise[${i}].Isfixedfranchise`))
                                                }}
                                                defaultValue={get(product, `franchise[${i}].fixedvalue`, 0)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].typeoffranchise`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={franchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                                defaultValue={get(product, `franchise[${i}].typeoffranchise`)}
                                            />
                                        </Flex>
                                    </td>
                                    <td className={'w-250'}>
                                        <Flex justify={'center'}>
                                            <Field
                                                className={'w-250'}
                                                name={`franchise[${i}].baseoffranchise`}
                                                type={'select'}
                                                property={{hideLabel: true}}
                                                options={baseFranchises}
                                                isDisabled={!!!(get(fields, `franchise[${i}].Isfranchise`))}
                                                defaultValue={get(product, `franchise[${i}].baseoffranchise`)}
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
                                                    disabled: !(get(fields, `franchise[${i}].Isfranchise`) && !get(fields, `franchise[${i}].Isfixedfranchise`))
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