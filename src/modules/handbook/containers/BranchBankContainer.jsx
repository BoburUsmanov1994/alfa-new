import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery,  usePutQuery} from "../../../hooks/api";
import Table from "../../../components/table";
import Form from "../../../containers/form/form";
import Button from "../../../components/ui/button";
import {useTranslation} from "react-i18next";
import Section from "../../../components/section";
import {Col, Row} from "react-grid-system";
import Title from "../../../components/ui/title";
import {ContentLoader} from "../../../components/loader";

const BranchBankContainer = () => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Справочники',
            path: '/handbook',
        },
        {
            id: 2,
            title: 'Банк реквизиты филиалов',
            path: '/handbook/branch-bank-settings',
        }
    ], [])
    const {mutate, isLoading} = usePutQuery({listKeyId: KEYS.specificList})
    let {data} = useGetAllQuery({key: KEYS.specificList, url: `${URLS.specificList}`})



    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    return (
        <Section>
            {isLoading && <ContentLoader/>}
            <Row  align={'center'}>
                <Col xs={12} className={'mb-15'}>
                    <Title>Банк реквизиты филиалов</Title>
                </Col>
                <Col xs={12}>
                    <Form formRequest={(attr)=>{
                        mutate({
                            url:'api/branch/edit/bulk-update',
                            attributes:get(attr,'data.branch',[])
                        })
                    }} footer={<Button className={'mt-30'} type={"submit"} lg>{t("Сохранить")}</Button>} >
                        <Table
                            hideThead={false}
                            thead={[
                                "Наименование филиала",
                                "МФО банка",
                                "Расчетный счет",
                            ]}
                        >
                            {get(data,'data.data',[]).map((item, i) => (
                                <tr key={i}>
                                    <td>
                                        <Field
                                            property={{disabled: true, type: 'hidden', hideLabel: true}}
                                            defaultValue={get(item, "_id")}
                                            type={'input'}
                                            name={`branch[${i}].id`}
                                        />
                                        <Field
                                            type={"input"}
                                            name={`branch[${i}].branchName`}
                                            defaultValue={get(item, "branchName")}
                                            property={{ hideLabel: true,disabled:true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={"input"}
                                            name={`branch[${i}].mfo`}
                                            defaultValue={get(item, "mfo")}
                                            property={{ hideLabel: true}}
                                        />
                                    </td>
                                    <td>
                                        <Field
                                            type={"input"}
                                            name={`branch[${i}].checkingAccount`}
                                            defaultValue={get(item, "checkingAccount")}
                                            property={{ hideLabel: true}}
                                        />
                                    </td>
                                </tr>))}
                        </Table>
                    </Form>
                </Col>
            </Row>

        </Section>
    );
};

export default BranchBankContainer;