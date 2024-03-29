import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useGetAllQuery} from "../../../hooks/api";
import {getSelectOptionsListFromData} from "../../../utils";

const BcoTypeContainer = ({...rest}) => {
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))

    let {data: bcoStatusList} = useGetAllQuery({
        key: KEYS.statusoftypebco,
        url: `${URLS.bcoStatus}/list`
    })
    bcoStatusList = getSelectOptionsListFromData(get(bcoStatusList, `data`, []), '_id', 'name')

    let {data: languageList} = useGetAllQuery({
        key: KEYS.languagepolicy,
        url: `${URLS.bcoLanguage}/list`
    })
    languageList = getSelectOptionsListFromData(get(languageList, `data`, []), '_id', 'name')

    let {data: policyFormatList} = useGetAllQuery({
        key: KEYS.policyformats,
        url: `${URLS.policyFormat}/list`
    })
    policyFormatList = getSelectOptionsListFromData(get(policyFormatList, `data`, []), '_id', 'name')
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Accounting',
            path: '/accounting',
        },
        {
            id: 2,
            title: 'Bco type',
            path: '/accounting/bco-type',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'policy_type_name'} type={'input'} label={'Название'}
               defaultValue={rowId ? get(data, 'policy_type_name') : null}
               params={{required: true}}/>
        <Field name={'policy_size_id'} options={policyFormatList} type={'select'} label={'Policy size'}
               defaultValue={rowId ? get(data, 'policy_size_id') : null}
               params={{required: true}}/>
        <Field isMulti name={'language'} options={languageList} type={'select'} label={'Language'}
               defaultValue={rowId ? get(data, 'language') : null}
               params={{required: true}}/>
        <Field name={'policy_series'} type={'input'} label={'Policy series'}
               defaultValue={rowId ? get(data, 'policy_series') : null}
               params={{required: true}}/>
        <Field name={'policy_number_of_digits'} type={'input'} label={'Digit number'}
               defaultValue={rowId ? get(data, 'policy_number_of_digits') : null}
               params={{required: true, valueAsNumber: true}}/>
        <Field name={'statusofpolicy'} options={bcoStatusList} type={'select'} label={'Policy status'}
               defaultValue={rowId ? get(data, 'statusofpolicy') : null}
               params={{required: true}}/>
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'policy_type_name',
                        title: 'Название'
                    },
                    {
                        id: 2,
                        key: 'policy_size_id',
                        title: 'Size'
                    },
                    {
                        id: 3,
                        key: 'statusofpolicy',
                        title: 'Status'
                    },
                    {
                        id: 33,
                        key: 'language',
                        title: 'Language',
                    },
                    {
                        id: 4,
                        key: 'policy_number_of_digits',
                        title: 'Digit number'
                    },
                ]}
                keyId={KEYS.typeofbco}
                url={URLS.bcoType}
                listUrl={`${URLS.bcoType}/list`}
                title={'BCO types'}
                responseDataKey={'data'}
            />
        </>
    );
};

export default BcoTypeContainer;