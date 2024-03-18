import React, {useState} from 'react';
import {Row, Col} from "react-grid-system";
import Search from "../../../components/search";
import Panel from "../../../components/panel";
import Section from "../../../components/section";
import Title from "../../../components/ui/title";
import Field from "../../../containers/form/field";
import {get, isEqual, range} from "lodash";
import {useGetAllQuery, useGetOneQuery, usePostQuery} from "../../../hooks/api";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {getSelectOptionsListFromData} from "../../../utils";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import {useNavigate} from "react-router-dom";
import {OverlayLoader} from "../../../components/loader";

const EmployeeAddContainer = ({id = null, branch = {}, ...rest}) => {
    const [region, setregion] = useState(null)
    const navigate = useNavigate();
    let {data: branchLevels} = useGetAllQuery({key: KEYS.branches, url: URLS.branches})
    branchLevels = getSelectOptionsListFromData(get(branchLevels, `data.data`, []), '_id', 'branchname')

    let {data: regions} = useGetAllQuery({key: KEYS.regions, url: URLS.regions})
    regions = getSelectOptionsListFromData(get(regions, `data.data`, []), '_id', 'name')


    let {data: districts} = useGetOneQuery({
        id: region,
        key: KEYS.districtsByRegion,
        url: URLS.districtsByRegion,
        enabled: !!(region)
    })
    districts = getSelectOptionsListFromData(get(districts, `data.data`, []), '_id', 'name')

    let {data: positions} = useGetAllQuery({key: KEYS.position, url: URLS.position})
    positions = getSelectOptionsListFromData(get(positions, `data.data`, []), '_id', 'name')

    let {data: genders} = useGetAllQuery({key: KEYS.genders, url: URLS.genders})
    genders = getSelectOptionsListFromData(get(genders, `data.data`, []), '_id', 'name')
    let {data: citizenship} = useGetAllQuery({key: KEYS.citizenship, url: URLS.citizenship})
    citizenship = getSelectOptionsListFromData(get(citizenship, `data.data`, []), '_id', 'name')

    const {mutate: createRequest, isLoading} = usePostQuery({listKeyId: KEYS.employee})

    const create = ({data}) => {
        createRequest({url: URLS.employee, attributes: {...data, photo: ""}}, {
            onSuccess: () => {
                navigate('/branches/employees')
            },
            onError: () => {
            }
        })
    }

    const setObjectType = (val, name) => {
        if (isEqual(name, 'regions') && val) {
            setregion(val);
        }
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
                        <Title>Add employee</Title>
                    </Col>
                </Row>
                <Form getValueFromField={(val, name) => setObjectType(val, name)}
                      footer={<Button type={"submit"} lg>Add</Button>} formRequest={(values) => create(values)}>
                    <Row className={'mb-15'}>
                        <Col xs={4}>
                            <Field name={'name'} type={'input'}
                                   label={'Name'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'secondname'} type={'input'}
                                   label={'Secondname'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'middlename'} type={'input'}
                                   label={'Middlename'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'branch'} type={'select'} label={'Branch'}
                                   options={branchLevels}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'position'} type={'select'} label={'Position'}
                                   options={positions}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'job_title'} type={'input'}
                                   label={'Job title'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'passportSeries'} type={'input-mask'}
                                   label={'Passport seria'}
                                   property={{mask: 'aa', maskChar: '_'}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'passportNumber'} type={'input-mask'}
                                   label={'Passport number'}
                                   property={{mask: '9999999', maskChar: '_'}}
                            />
                        </Col>
                        <Col xs={4}>


                            <Field name={'pin'} type={'input-mask'} label={'PINFL'}
                                   property={{mask: '99999999999999', maskChar: '_'}}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'regions'} type={'select'} label={'Region'} options={regions}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'districts'} type={'select'} label={'District'} options={districts}
                                   params={{required: true}}/>
                        </Col>


                        <Col xs={4}>
                            <Field name={'address'} type={'input'}
                                   label={'address'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'telephonenumber'} type={'input'}
                                   label={'Phone'}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'dateofbirth'} type={'datepicker'}
                                   label={'Birth date'}
                            />
                        </Col>
                        <Col xs={4}>
                            <Field name={'gender'} type={'select'} label={'Gender'} options={genders}
                                   params={{required: true}}/>
                        </Col>
                        <Col xs={4}>
                            <Field name={'citizenship'} type={'select'} label={'Citizenship'} options={citizenship}
                                   params={{required: true}}/>
                        </Col>


                    </Row>


                </Form>
            </Section>
        </>
    );
};

export default EmployeeAddContainer;