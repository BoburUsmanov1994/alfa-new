import React, {useEffect, useMemo} from 'react';
import {useSettingsStore, useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";

const ListContainer = ({...rest}) => {
    const {t} = useTranslation()
    const user = useStore(state => get(state, 'user', null))

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'СМР',
            path: '/insurance/smr',
        },
        {
            id: 2,
            title: 'СМР',
            path: '/insurance/smr',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data, rowId = null}) => <>
        <Field name={'name'} type={'input'} label={'Название продукта'} defaultValue={rowId ? get(data, 'name') : null}
               params={{required: true}}/>
    </>

    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'insurant',
                        title: 'Наименование',
                        render: (tr) => get(tr, 'insurant.name')
                    },
                    {
                        id: 2,
                        key: 'branch_id',
                        title: 'Филиал',
                    },
                    {
                        id: 3,
                        key: 'contract_id',
                        title: 'Номер договора',
                        render: (tr) => get(tr, 'policy.number')
                    },
                    {
                        id: 4,
                        key: 'policy',
                        title: 'Серия полиса',
                        render: (tr) => get(tr, 'policy.seria')
                    },
                    {
                        id: 5,
                        key: 'insurant',
                        title: 'Номер полиса',
                        render: (tr) => get(tr, 'policy.number')
                    },
                    {
                        id: 7,
                        key: 'policy.ins_sum',
                        title: 'Insurance sum',
                        render: (tr) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={get(tr,'policy.ins_sum')}/>
                    },
                    {
                        id: 6,
                        key: 'policy.ins_premium',
                        title: 'Insurance premium',
                        render: (tr) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={get(tr,'policy.ins_premium')}/>
                    },
                    {
                        id: 7,
                        key: 'createdAt',
                        title: 'Created at',
                        render: (tr) => get(tr,'createdAt') ? dayjs(get(tr,'createdAt')).format("DD-MM-YYYY HH:mm") : '-'
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },
                ]}
                keyId={KEYS.smrList}
                url={URLS.smrList}
                title={t('СМР')}
                responseDataKey={'data.docs'}
                viewUrl={'/insurance/smr/view'}
                isHideColumn
                dataKey={'contract_id'}
                deleteUrl={URLS.smrDelete}
                hideCreateBtn={true}
                params={{
                    branch:get(user,'branch.id')
                }}
            />
        </>
    );
};

export default ListContainer;