import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import Field from "../../../containers/form/field";
import {useTranslation} from "react-i18next";

const ProductStatusContainer = ({...rest}) => {
    const {t} = useTranslation()
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Продукты"),
            path: '/products',
        },
        {
            id: 2,
            title: t("Статус продукта"),
            path: '/products/product-status',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const ModalBody = ({data,rowId = null}) =>  <>
        <Field  name={'name'} type={'input'} label={t("Название")} defaultValue={rowId ? get(data,'name'):null} params={{required: true}} />
    </>
    return (
        <>
            <GridView
                ModalBody={ModalBody}
                tableHeaderData={[
                    {
                        id: 2,
                        key: 'name',
                        title: t("Название")
                    },
                ]}
                keyId={KEYS.statusofproduct}
                url={URLS.statusofproduct}
                listUrl={`${URLS.statusofproduct}/list`}
                title={t('Статус продукта')}
                responseDataKey={'data.data'}

            />
        </>
    );
};

export default ProductStatusContainer;