import React,{useState} from 'react';
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
import Button from "../../../components/ui/button";
import {Minus, Plus} from "react-feather";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../components/loader";

const BranchCreateContainer = ({id = null, branch = {}, ...rest}) => {
    const navigate = useNavigate();
    let {data: branchLevels} = useGetAllQuery({key: KEYS.levelofbranch, url: URLS.levelofbranch})
    branchLevels = getSelectOptionsListFromData(get(branchLevels, `data.data`, []), '_id', 'name')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    regions = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')

    let {data: positions} = useGetAllQuery({key: KEYS.position, url: URLS.position})
    positions = getSelectOptionsListFromData(get(positions, `data.data`, []), '_id', 'name')

    let {data: branchStatusList} = useGetAllQuery({key: KEYS.breanchstatus, url: URLS.breanchstatus})
    branchStatusList = getSelectOptionsListFromData(get(branchStatusList, `data.data`, []), '_id', 'name')

    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.branches})

    const [empCount,setEmpCount] = useState(1);

    const create = ({data}) => {
        createRequest({url:URLS.branches, attributes: data}, {
            onSuccess: () => {
                navigate('/branches')
            },
            onError: () => {

            }
        })
    }
    return (
        <>
            {isLoading && <OverlayLoader />}
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
                        <Title>Branch create</Title>
                    </Col>
                </Row>
                <Form footer={ <Button type={"submit"} lg>Save</Button>} formRequest={(values)=>create(values)}>
                    <Row className={'mb-15'}>
                        <Col xs={4}>
                            <Field name={'levelofbreanches'} type={'select'} label={'Branch level'}
                                   options={branchLevels}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'codeofbreanches'} type={'input'}
                                   label={'codeofbreanches'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'inn'} type={'input-mask'} label={'INN'}
                                   property={{mask: '999999999', maskChar: '_'}}
                                   params={{required: true, pattern: /^[0-9]*$/}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'region'} type={'select'} label={'Region'} options={regions}
                                    params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'branchname'} type={'input'}
                                   label={'branchname'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'shorttitleofbranch'} type={'input'}
                                   label={'shorttitleofbranch'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'address'} type={'input'}
                                   label={'address'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'telephone'} type={'input'}
                                   label={'telephone'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'email'} type={'input'}
                                   label={'email'}
                                   property={{type: "email"}}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementnumber'} type={'input'}
                                   label={'agreementnumber'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'agreementdate'} type={'datepicker'}
                                   label={'agreementdate'}
                                  />
                        </Col>
                        <Col xs={4}>
                            <Field name={'expirationdate'} type={'datepicker'}
                                   label={'expirationdate'}
                                   />
                        </Col>
                        <Col xs={4}>
                            <Field name={`checkingaccount`} type={'input'}
                                   label={'checkingaccount'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={`mfo`} type={'input'}
                                   label={'mfo'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={`nameofbank`} type={'input'}
                                   label={'nameofbank'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'breanchstatus'} type={'select'} label={'Branch status'}
                                   options={branchStatusList}
                                   params={{required: true}}/>
                        </Col>


                    </Row>
                    <Row className={"mb-15"}>
                        <Col xs={12}>
                            <Title sm>Add employee</Title>
                        </Col>
                    </Row>
                    {range(0,empCount).map((count,i) => <Row align={'center'}>
                        <Col xs={11}>
                            <Row>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].fullname`} type={'input'}
                                           label={'Fullname'}
                                           params={{required: true}}/>
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].positions`} type={'select'} label={'Positions'} options={positions}
                                           params={{required: true}} />
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].telephonenumber`} type={'input'}
                                           label={'telephonenumber'}
                                           params={{required: true}}/>
                                </Col>
                                <Col xs={3}>
                                    <Field name={`employees[${count}].emailforcontacts`} type={'input'}
                                           label={'emailforcontacts'}
                                           property={{type:"email"}}

                                           params={{required: true}}/>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={1} className={"text-right"}>
                            {isEqual(empCount,count+1) ? <Button onClick={()=>setEmpCount(prev => ++prev)} sm type={"button"} inline><Plus /></Button>:<Button danger onClick={()=>setEmpCount(prev => --prev)} sm type={"button"} inline><Minus /></Button>}
                        </Col>
                    </Row>)}

                </Form>
            </Section>
        </>
    );
};

export default BranchCreateContainer;