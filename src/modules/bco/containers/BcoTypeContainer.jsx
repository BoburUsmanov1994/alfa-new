import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";
import {Col, Row} from "react-grid-system";
import { useTranslation } from 'react-i18next';

const BcoTypeContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()

    let {data: bcoStatusList} = useGetAllQuery({
        key: KEYS.statusoftypebco,
        url: `${URLS.bcoStatus}/list`
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data.data`, []), '_id', 'name')

    let {data: languageList} = useGetAllQuery({
        key: KEYS.languagepolicy,
        url: `${URLS.bcoLanguage}/list`
    })
    languageList = getSelectOptionsListFromData(get(languageList, `data.data`, []), '_id', 'name')

    let {data: policyFormatList} = useGetAllQuery({
        key: KEYS.policyformats,
        url: `${URLS.policyFormat}/list`
    })
    policyFormatList = getSelectOptionsListFromData(get(policyFormatList, `data.data`, []), '_id', 'name')
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Accounting"),
            path: '/accounting',
        },
        {
            id: 2,
            title: t("Bco type"),
            path: '/accounting/bco-type',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <Row>
        <Col xs={6}>
            <Field name={'policy_type_name'} type={'input'} label={t("Название")}
                   defaultValue={rowId ? get(data, 'policy_type_name') : null}
                   params={{required: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_size_id'} options={policyFormatList} type={'select'} label={t("Policy size")}
                   defaultValue={rowId ? get(data, 'policy_size_id') : null}
                   params={{required: true}}/>
        </Col>
        <Col xs={6}>
            <Field isMulti name={'language'} options={languageList} type={'select'} label={t("Language")}
                   defaultValue={rowId ? get(data, 'language') : null}
                   params={{required: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_series'} type={'input'} label={t("Policy series")}
                   defaultValue={rowId ? get(data, 'policy_series') : null}
                   params={{required: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'policy_number_of_digits'} type={'input'} label={t("Digit number")}
                   defaultValue={rowId ? get(data, 'policy_number_of_digits') : null}
                   params={{required: true, valueAsNumber: true}}/>
        </Col>
        <Col xs={6}>
            <Field name={'status'} options={bcoStatusList} type={'select'} label={t("Policy status")}
                   defaultValue={rowId ? get(data, 'status') : null}
                   params={{required: true}}/>
        </Col>
    </Row>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'policy_type_name',
                        title: t("Название")
                    },
                    {
                        id: 2,
                        key: 'policy_size_id.name',
                        title: t("Size")
                    },
                    {
                        id: 3,
                        key: 'status.name',
                        title: t("Status")
                    },
                    {
                        id: 33,
                        key: 'language',
                        title: t("Language"),
                        isArray: true,
                        arrayKey: 'name'
                    },
                    {
                        id: 4,
                        key: 'policy_number_of_digits',
                        title: t("Digit number")
                    },
                ]}
                keyId={KEYS.typeofbco}
                url={URLS.bcoType}
                listUrl={`${URLS.bcoType}/list`}
                title={t("BCO types")}
                responseDataKey={'data.data'}
            />
        </>
    );
};

export default BcoTypeContainer;