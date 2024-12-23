import React, {useEffect, useMemo} from 'react';
import {useStore} from "../../../store";
import {get, isEqual} from "lodash";
import GridView from "../../../containers/grid-view/grid-view";
import {KEYS} from "../../../constants/key";
import {URLS} from "../../../constants/url";
import {Download, RefreshCcw} from "react-feather";
import {usePostQuery} from "../../../hooks/api";
import {ContentLoader} from "../../../components/loader";
import config from "../../../config";
import { useTranslation } from 'react-i18next';

const AgentsContainer = ({...rest}) => {

    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const {t} = useTranslation()
    const {mutate:generateAgentAgreement,isLoading} = usePostQuery({listKeyId:[KEYS.agents,1]})

    const breadcrumbs = useMemo(() => [
        {
            id: 1,
            title: t("Агенты"),
            path: '/agents',
        },
        {
            id: 2,
            title: t("Страховые агенты"),
            path: '/agents/insurance-agents',
        }
    ], [])

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    return (
        <>
            {
                isLoading && <ContentLoader />
            }
            <GridView
                extraActions={(tr)=><><RefreshCcw onClick={()=>{
                    generateAgentAgreement({
                        url:`${URLS.agentAgreement}/${get(tr,"_id")}`
                    })
                }}  size={20} style={{marginLeft:10,cursor:'pointer',color:'#306962'}} /></>}
                tableHeaderData={[
                    {
                        id: 1,
                        key: 'inn',
                        title: t("INN")
                    },
                    {
                        id: 3,
                        key: 'typeofagent.name',
                        title: t("Agent type")
                    },
                    {
                        id: 4,
                        key: 'organization.nameoforganization',
                        title: t("organization name")
                    },
                    {
                        id: 5,
                        key: 'person.secondname',
                        title: t("Lastname")
                    },
                    {
                        id: 55,
                        key: 'person.name',
                        title: t("Firstname")
                    },

                    {
                        id: 556,
                        key: 'person.middlename',
                        title: t("Middlename")
                    },
                    {
                        id: 555,
                        key: 'agreementPath',
                        title: t("Agreement file"),
                        render:(_tr)=>{
                            return get(_tr,'agreementPath') && <a href={`${config.FILE_URL}/${get(_tr,'agreementPath')}`} target={'_blank'}><Download /></a>
                        }
                    },
                ]}
                keyId={KEYS.agents}
                url={URLS.agents}
                listUrl={`${URLS.agents}/list`}
                title={t("Страховые агенты")}
                responseDataKey={'data.data'}
                createUrl={'/agents/create'}
                updateUrl={'/agents/update'}
                isHideColumn
                hasUpdateBtn={true}
            />
        </>
    );
};

export default AgentsContainer;