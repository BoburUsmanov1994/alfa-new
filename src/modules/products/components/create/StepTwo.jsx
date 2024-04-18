import React, {useState} from 'react';
import {Col, Row} from "react-grid-system";
import StepNav from "../../../../components/step-nav";
import Field from "../../../../containers/form/field";
import Form from "../../../../containers/form/form";
import Button from "../../../../components/ui/button";
import {useSettingsStore} from "../../../../store";
import {get, includes} from "lodash"
import Flex from "../../../../components/flex";
import {URLS} from "../../../../constants/url";
import {useDeleteQuery, useGetAllQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import styled from "styled-components";
import {Download, Trash2} from "react-feather";
import {getSelectOptionsListFromData} from "../../../../utils";

const Styled = styled.div`
  .doc-files {
    background: #FFFFFF;
    border: 1px solid #9A9A9A;
    border-radius: 10px;
    padding: 30px;
    max-width: 400px;
    li{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      &:last-child{
        margin-bottom: 0;
      }
      span{
        font-family: 'Gilroy-Bold', sans-serif;
      }
      a{
      margin-right: 10px;
      }
    }
  }
`;
const StepTwo = ({...props}) => {

    const [show, setShow] = useState({isapplicationform: false, iscontractform: false, Isadditionaldocuments: false})

    const setProduct = useSettingsStore(state => get(state, 'setProduct', () => {
    }))

    const resetProduct = useSettingsStore(state => get(state, 'resetProduct', () => {
    }))
    const resetRiskList = useSettingsStore(state => get(state, 'resetRiskList', []))

    const product = useSettingsStore(state => get(state, 'product', {}))

    const {data:applicationformdocs} = useGetAllQuery({key: KEYS.applicationformdocs, url: `${URLS.applicationForm}/list`})
    const {data:contractform} = useGetAllQuery({key: KEYS.contractform, url: `${URLS.contractForm}/list`})
    const {data:additionaldocuments} = useGetAllQuery({key: KEYS.additionaldocuments, url: `${URLS.additionaldocuments}/list`})
    const {mutate: deleteApplicationFormDocs} = useDeleteQuery({listKeyId: KEYS.applicationformdocs})
    const {mutate: deleteContactForm} = useDeleteQuery({listKeyId: KEYS.contractform})
    const {mutate: deleteAdditionalDocs} = useDeleteQuery({listKeyId: KEYS.additionaldocuments})


    const nextStep = ({data}) => {
        setProduct(data);
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

    const showFile = (value, name) => {
        if (includes(['hasApplicationForm', 'hasContractForm', 'hasAdditionalDocuments'], name)) {
            setShow(prev => ({...prev, [name]: value}))
        }
    }

    return (
        <Styled>
            <Row>
                <Col xs={12}>
                    <StepNav step={2}/>
                </Col>
                <Col xs={12}>
                    <Form formRequest={nextStep} getValueFromField={showFile}>
                        <Row className={'mb-25'}>
                            <Col xs={4}>
                                <Flex align={'flex-end'}>
                                    <Field label={'Имеет форму анкеты заявления'} type={'switch'}
                                           name={'hasApplicationForm'}
                                            defaultValue={get(product,'hasApplicationForm',false)}

                                    />
                                </Flex>
                                {get(show, 'hasApplicationForm', false) && <Field type={'select'} name={'applicationForm'} options={getSelectOptionsListFromData(get(applicationformdocs,'data.data',[]),'_id','name')} />}

                            </Col>
                            <Col xs={4}>
                                <Flex align={'flex-end'}>
                                    <Field label={'Имеет конракт'} type={'switch'} name={'hasContractForm'}
                                           defaultValue={get(product,'hasContractForm',false)} />
                                </Flex>
                                {get(show, 'hasContractForm', false) && <Field type={'select'} name={'contractForm'} options={getSelectOptionsListFromData(get(contractform,'data.data',[]),'_id','name')} />}
                            </Col>
                            <Col xs={4}>
                                <Flex align={'flex-end'}>
                                    <Field label={'Имеет приложение'} type={'switch'} name={'hasAdditionalDocuments'}
                                           defaultValue={get(product,'hasAdditionalDocuments',false)} />
                                </Flex>
                                {get(show, 'hasAdditionalDocuments', false) && <Field type={'select'} name={'additionalDocuments'} options={getSelectOptionsListFromData(get(additionaldocuments,'data.data',[]),'_id','name')} />}
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
        </Styled>
    );
};

export default StepTwo;