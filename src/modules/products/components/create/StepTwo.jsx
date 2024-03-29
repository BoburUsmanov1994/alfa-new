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
    const {data:additionaldocuments} = useGetAllQuery({key: KEYS.additionaldocuments, url: URLS.additionaldocuments})
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
        if (includes(['isapplicationform', 'iscontractform', 'Isadditionaldocuments'], name)) {
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
                                           name={'isapplicationform'}
                                            defaultValue={get(product,'isapplicationform',false)}

                                    />
                                    {get(show, 'isapplicationform', false) &&
                                        <Field className={'ml-50'} label={'Имеет форму анкеты заявления'}
                                               type={'dropzone'}
                                               name={'applicationformId'}
                                               property={{hideLabel: true, url: URLS.applicationformdocs,key:KEYS.applicationformdocs}}/>}
                                </Flex>
                                {get(show, 'isapplicationform', false) && <ul className={'doc-files'}>
                                    {get(applicationformdocs,'data.data',false) && get(applicationformdocs,'data.data',[]).map(file =><li key={get(file,'_id')}>
                                        <span>{get(file,'name','-')}</span> <div><a href={get(file,'url','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a>
                                        <Trash2 onClick={()=>deleteApplicationFormDocs({url: `${URLS.applicationformdocs}/${get(file,'_id',null)}`})} className={'cursor-pointer '} color={'#dc2626'} /></div>
                                    </li>)}
                                </ul>}

                            </Col>
                            <Col xs={4}>
                                <Flex align={'flex-end'}>
                                    <Field label={'Имеет конракт'} type={'switch'} name={'iscontractform'}
                                           defaultValue={get(product,'iscontractform',false)} />
                                    {get(show, 'iscontractform', false) &&
                                        <Field className={'ml-50'} label={'Имеет форму анкеты заявления'}
                                               type={'dropzone'}
                                               name={'contractform'}
                                               property={{hideLabel: true, url: URLS.contractform,key:KEYS.contractform}}/>}
                                </Flex>
                                {get(show, 'iscontractform', false) && <ul className={'doc-files'}>
                                    {get(contractform,'data.data',false) && get(contractform,'data.data',[]).map(file =><li key={get(file,'_id')}>
                                        <span>{get(file,'name','-')}</span> <div><a href={get(file,'url','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a>
                                        <Trash2 onClick={()=>deleteContactForm({url: `${URLS.contractform}/${get(file,'_id',null)}`})} className={'cursor-pointer '} color={'#dc2626'} /></div>
                                    </li>)}
                                </ul>}
                            </Col>
                            <Col xs={4}>
                                <Flex align={'flex-end'}>
                                    <Field label={'Имеет приложение'} type={'switch'} name={'Isadditionaldocuments'}
                                           defaultValue={get(product,'Isadditionaldocuments',false)} />
                                    {get(show, 'Isadditionaldocuments', false) &&
                                        <Field className={'ml-50'} label={'Имеет форму анкеты заявления'}
                                               type={'dropzone'}
                                               name={'additionaldocuments'}
                                               property={{hideLabel: true, url: URLS.additionaldocuments,key:KEYS.additionaldocuments}}/>}
                                </Flex>
                                {get(show, 'Isadditionaldocuments', false) && <ul className={'doc-files'}>
                                    {get(additionaldocuments,'data.data',false) && get(additionaldocuments,'data.data',[]).map(file =><li key={get(file,'_id')}>
                                        <span>{get(file,'name','-')}</span> <div><a href={get(file,'url','#')} target={'_blank'} download><Download color={'#13D6D1'} /></a>
                                        <Trash2 onClick={()=>deleteAdditionalDocs({url: `${URLS.additionaldocuments}/${get(file,'_id',null)}`})} className={'cursor-pointer '} color={'#dc2626'} /></div>
                                    </li>)}
                                </ul>}
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