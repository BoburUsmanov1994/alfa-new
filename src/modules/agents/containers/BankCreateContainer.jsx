import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, isEqual, range} from "lodash";
import {useGetAllQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import Form from "../../../containers/form/form";
import {OverlayLoader} from "../../../components/loader";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {Minus, Plus} from "react-feather";
import dayjs from "dayjs";
import {PERSON_TYPE} from "../../../constants";
import {useTranslation} from "react-i18next";

const BankCreateContainer = () => {
    const navigate = useNavigate();
    const {t} = useTranslation()
    const [count, setCount] = useState(1)

    let {data: banks} = useGetAllQuery({key: KEYS.bank, url: `${URLS.bank}/list`})
    banks = getSelectOptionsListFromData(get(banks, `data.data`, []), '_id', 'name')

    let {data: products} = useGetAllQuery({key: KEYS.products, url: `${URLS.products}`})
    products = getSelectOptionsListFromData(get(products, `data.data`, []), 'code', 'name')


    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.bank})
    const create = ({data}) => {
        createRequest({
            url: URLS.bank,
            attributes: {...data}
        }, {
            onSuccess: () => {
                navigate('/agents/bank')
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
                        <Title>Bank create</Title>
                    </Col>
                </Row>
                <Form
                    footer={<Button>Save</Button>} formRequest={(values) => create(values)}>
                    <Row>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={'INN'}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{pattern: /^[0-9]*$/}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'mainBank'} type={'select'} label={'Main bank'} options={banks}
                            />
                        </Col>

                        <Col xs={4}>
                            <Field name={'name'} type={'input'}
                                   label={'Name'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'username'} type={'input'}
                                   label={'Username'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field property={{type: 'password'}} name={'password'} type={'input'}
                                   label={'Password'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={11} className={"mb-15"}>
                            <Title sm>{t('Add rate')}</Title>
                        </Col>
                        <Col xs={1} className={'text-right'}>
                            <Button onClick={() => setCount(prev => ++prev)} sm type={"button"}
                                    inline><Plus/></Button>
                        </Col>
                        {
                            range(0, count).map((item, index) => <Col xs={12} className={'box__outlined'}>
                                <Row align={"center"}>
                                    <Col xs={11}>
                                        <Row>
                                            <Col xs={3}>
                                                <Field name={`rates[${index}].productCode`} type={'select'}
                                                       label={'Product'}
                                                       options={products}
                                                       params={{required: true}}
                                                />
                                            </Col>
                                            <Col xs={3}>
                                                <Field
                                                    label={'Rate'}
                                                    type={'number-format-input'}
                                                    name={`rates[${index}].rate`}
                                                    params={{required: true}}/>
                                            </Col>
                                            <Col xs={3}>
                                                <Field
                                                    label={'Allow change rate?'}
                                                    type={'switch'}
                                                    name={`rates[${index}].allowChangeRate`}
                                                    params={{required: true}}/>
                                            </Col>
                                            <Col xs={3}>
                                                <Field
                                                    label={'Has rate tied to term?'}
                                                    type={'switch'}
                                                    name={`rates[${index}].hasRateTiedToTerm`}
                                                    params={{required: true}}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={1} className={"text-right "}>
                                        {item >= 1 &&
                                            <Button danger onClick={() => setCount(prev => --prev)} sm type={"button"}
                                                    inline><Minus/></Button>}
                                    </Col>
                                </Row>
                            </Col>)
                        }
                    </Row>
                </Form>
            </Section>
        </>
    );
};

export default BankCreateContainer;