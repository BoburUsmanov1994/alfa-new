import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import Button from "../../../components/ui/button";
import {useTranslation} from "react-i18next";
import {usePutQuery} from "../../../hooks/api";
import {OverlayLoader} from "../../../components/loader";
import {Check} from "react-feather";

const EndorsementContainer = () => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: 'Индоссамент',
            path: '/endorsements',
        },
    ], [])

    const {mutate: allowRequest, isLoading} = usePutQuery({listKeyId: KEYS.endorsements})
    const allow = (_id, _isAllowed = true) => {
        allowRequest({
            url: `${URLS.endorsements}/${_id}`,
            attributes: {
                allow: _isAllowed
            }
        })
    }

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    return (
        <>
            {isLoading && <OverlayLoader/>}
            <GridView
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'agreement.agreementNumber',
                        title: '№ договора'
                    },
                    {
                        id: 2,
                        key: 'createdAt',
                        title: 'Дата договора',
                        render: (_tr) => dayjs(get(_tr, 'createdAt')).format("DD.MM.YYYY")
                    },
                    {
                        id: 3,
                        key: 'reason',
                        title: 'Причина',
                    },
                    {
                        id: 4,
                        key: 'product.name',
                        title: 'Продукт',
                    },
                    {
                        id: 5,
                        key: 'insuranceSum',
                        title: 'Страховая сумма',
                        render: (_tr) => <NumberFormat thousandSeparator={' '} displayType={'text'}
                                                       value={get(_tr, 'insuranceSum')}/>
                    },
                    {
                        id: 6,
                        key: 'insurancePremium',
                        title: 'Страховая премия',
                        render: (_tr) => <NumberFormat thousandSeparator={' '} displayType={'text'}
                                                       value={get(_tr, 'insurancePremium')}/>
                    },
                    {
                        id: 7,
                        key: 'startDate',
                        title: 'Начало покрытия',
                        render: (_tr) => dayjs(get(_tr, 'startDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 8,
                        key: 'endDate',
                        title: 'Конец покрытия',
                        render: (_tr) => dayjs(get(_tr, 'endDate')).format("DD.MM.YYYY")
                    },
                    {
                        id: 10,
                        key: 'createdAt',
                        title: 'Дата решения',
                        render: (_tr) => dayjs(get(_tr, 'createdAt')).format("DD.MM.YYYY")
                    },
                    {
                        id: 11,
                        key: 'request_creator.name',
                        title: 'Кем принято решение',
                    },
                    {
                        id: 12,
                        key: 'request_creator.name',
                        title: 'Решение',
                        render: (_tr) => get(_tr, 'decision') === 'waiting' ? <><Button danger
                                                                                        onClick={() => allow(get(_tr, '_id'), false)}>{t('Отказать')}</Button><Button
                            className={'ml-15'}
                            onClick={() => allow(get(_tr, '_id'))}>{t('Одобрить')}</Button></> : get(_tr, 'decision')
                    },
                ]}
                keyId={KEYS.endorsements}
                url={URLS.endorsements}
                listUrl={`${URLS.endorsements}/list`}
                title={'Индоссамент'}
                responseDataKey={'data.data'}
                hideCreateBtn
                hideDeleteBtn
                viewUrl={'/endorsement/view'}
            />
        </>
    );
};

export default EndorsementContainer;