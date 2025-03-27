import React, {useEffect, useMemo} from "react";
import {useStore} from "../../../../store";
import {get} from "lodash";
import GridView from "../../../../containers/grid-view/grid-view";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import Field from "../../../../containers/form/field";
import {useTranslation} from "react-i18next";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import {DollarSign, Download} from "react-feather";

const NbuContainer = () => {
    const {t} = useTranslation()

    const setBreadcrumbs = useStore((state) =>
        get(state, "setBreadcrumbs", () => {
        })
    );
    const breadcrumbs = useMemo(
        () => [
            {
                id: 1,
                title: "НБУ",
                path: "/insurance/nbu-credits",
            }
        ],
        []
    );
    useEffect(() => {
        setBreadcrumbs(breadcrumbs);
    }, []);

    const ModalBody = ({data, rowId = null}) => (
        <>
            <Field
                name={"name"}
                type={"input"}
                label={"Название продукта"}
                defaultValue={rowId ? get(data, "name") : null}
                params={{required: true}}
            />
        </>
    );
    return (
        <>
            <GridView
                hideDeleteBtn
                extraActions={(_tr)=><a target='_blank' href={get(_tr,'policies.url','#')}><Download /></a>}
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'insurant',
                        title: 'Client name',
                        render: (tr) => get(tr, 'insurant.client_name')
                    },
                    {
                        id: 2,
                        key: 'insurant.client_pinfl',
                        title: 'Pnfl',
                    },
                    {
                        id: 3,
                        key: 'insurant.client_birthday',
                        title: 'Birtdate',
                    },
                    {
                        id: 4,
                        key: 'policies.credit_name',
                        title: 'Credit name',
                    },
                    {
                        id: 5,
                        key: 'policies.credit_amount_in_cents',
                        title: 'credit_amount_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                 value={get(tr, 'policies.credit_amount_in_cents', 0)}/>
                    },
                    {
                        id: 7,
                        key: 'policies.begin_credit_date',
                        title: 'begin_credit_date',
                    },
                    {
                        id: 8,
                        key: 'policies.end_credit_date',
                        title: 'end_credit_date',
                    },
                    {
                        id: 9,
                        key: 'policies.policy_number',
                        title: 'policy_number',
                    },
                    {
                        id: 10,
                        key: 'policies.insurance_amount_in_cents',
                        title: 'insurance_amount_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                   value={get(tr, 'policies.insurance_amount_in_cents', 0)}/>
                    },
                    {
                        id: 10,
                        key: 'policies.insurance_premium_in_cents',
                        title: 'insurance_premium_in_cents',
                        render:(tr)=><NumberFormat displayType={'text'} thousandSeparator={" "}
                                                   value={get(tr, 'policies.insurance_premium_in_cents', 0)}/>
                    },

                ]}
                keyId={[KEYS.nbuIntegrations]}
                url={URLS.nbuIntegrations}
                title={t('Страхования кредитов НБУ')}
                responseDataKey={'data.docs'}
                isHideColumn
                hideCreateBtn={true}
                hasUpdateBtn={false}

            />

        </>
    );
};

export default NbuContainer;
