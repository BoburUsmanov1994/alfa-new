import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import NumberFormat from "react-number-format";
import {useTranslation} from "react-i18next";
import {Download} from "react-feather";
import dayjs from "dayjs";

const TerminationsContainer = () => {
    const {t} = useTranslation();
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Заявлений на расторжение',
            path: '/policy/terminations',
        },
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    return (
        <>
            <GridView

                tableHeaderData={[
                    {
                        id: 2,
                        key: 'number',
                        title: 'номер полиса'
                    },
                    {
                        id: 3,
                        key: 'seria',
                        title: 'серия полиса'
                    },
                    {
                        id: 3,
                        key: 'insurant',
                        title: 'страхователь',
                    },
                    {
                        id: 4,
                        key: 'terminateDate',
                        title: 'дата расторжения',
                    },
                    {
                        id: 5,
                        key: 'reason',
                        title: 'причина',
                    },
                    {
                        id: 33,
                        key: 'returningPremium',
                        title: 'сумма возврата',
                        render: (_tr)=><NumberFormat displayType={'text'} thousandSeparator={' '} value={get(_tr,'returningPremium')} />
                    },
                    {
                        id: 44,
                        key: 'payment',
                        title: 'наличие выплат',
                        render: (_tr)=>get(_tr,'payment.paymentDate') ? dayjs(get(_tr,'payment.paymentDate')).format('YYYY-MM-DD'):'-',
                    },
                    {
                        id: 55,
                        key: 'payment',
                        title: 'сумма выплат',
                        render: (_tr)=><NumberFormat displayType={'text'} thousandSeparator={' '} value={get(_tr,'payment.paymentSum')} />
                    },
                    {
                        id: 66,
                        key: 'terminationAgreementUrl',
                        title: 'ссылка на файл соглашения о расторжении',
                        render: (_tr)=><a href={get(_tr,'terminationAgreementUrl','#')} target={'_blank'}>
                            <Download />
                        </a>
                    },
                    {
                        id: 77,
                        key: 'sentDate',
                        title: 'дата отправки в НАПП',
                    },
                ]}
                keyId={KEYS.policyTerminations}
                listUrl={`${URLS.policyTerminations}`}
                title={'Заявлений на расторжение'}
                responseDataKey={'data.data'}
                hideDeleteBtn
                hideCreateBtn

            />
        </>
    );
};

export default TerminationsContainer;
