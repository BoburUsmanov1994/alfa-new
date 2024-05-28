import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";

const ListContainer = () => {
    const {t} = useTranslation()

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'ОСАГО',
            path: 'insurance/osago',
        },
        {
            id: 2,
            title: 'ОСАГО',
            path: 'insurance/osago',
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
                        id: 3,
                        key: 'seria',
                        title: 'Policy seria',
                    },
                    {
                        id: 4,
                        key: 'number',
                        title: 'Policy number',
                    },
                    {
                        id: 5,
                        key: 'owner',
                        title: 'Owner',
                        render: ({row}) => get(row, 'owner.applicantIsOwner') ? (get(row, 'applicant.person') ? `${get(row, 'applicant.person.fullName.lastname')} ${get(row, 'applicant.person.fullName.firstname')}  ${get(row, 'applicant.person.fullName.middlename')}` : get(row, 'applicant.organization.name')) : get(row, 'owner.person') ? `${get(row, 'owner.person.fullName.lastname')} ${get(row, 'owner.person.fullName.firstname')}  ${get(row, 'owner.person.fullName.middlename')}` : get(row, 'owner.organization.name')
                    },
                    {
                        id: 55,
                        key: 'applicant',
                        title: 'Applicant',
                        render: ({row}) => get(row, 'applicant.person') ? `${get(row, 'applicant.person.fullName.lastname')} ${get(row, 'applicant.person.fullName.firstname')}  ${get(row, 'applicant.person.fullName.middlename')}` : get(row, 'applicant.organization.name')
                    },
                    {
                        id: 44,
                        key: 'vehicle',
                        title: 'Vehicle',
                        render: ({row}) => get(row,'vehicle.modelCustomName')
                    },
                    {
                        id: 6,
                        key: 'cost.insurancePremium',
                        title: 'Insurance premium',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 7,
                        key: 'cost.sumInsured',
                        title: 'Insurance sum',
                        render: ({value}) => <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/>
                    },
                    {
                        id: 8,
                        key: 'cost.insurancePremiumPaidToInsurer',
                        title: 'Оплачено',
                        render: ({value,row}) => get(row,'status') == 'payed' ? <NumberFormat displayType={'text'} thousandSeparator={' '} value={value}/> : 0
                    },
                    {
                        id: 9,
                        key: 'status',
                        title: 'Status',
                    },

                ]}
                keyId={KEYS.osagoList}
                url={URLS.osagoList}
                listUrl={`${URLS.osagoList}`}
                deleteKey={`${URLS.osagoDelete}`}
                title={t('ОСАГО')}
                responseDataKey={'data.docs'}
                viewUrl={'/insurance/osago/view'}
                createUrl={'/insurance/osago/create'}
                updateUrl={'/insurance/osago/update'}
                isHideColumn
                dataKey={'application_number'}
                deleteUrl={URLS.osagoDelete}

            />
        </>
    );
};

export default ListContainer;