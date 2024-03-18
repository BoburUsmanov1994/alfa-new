import React from 'react';
import {useGetAllQuery} from "../../hooks/api";
import {OverlayLoader} from "../../components/loader";
import {KEYS} from "../../constants/key";
import {URLS} from "../../constants/url";
import {useSettingsStore,useStore} from "../../store";
import {get,isNil} from "lodash"

const Auth = ({children, ...rest}) => {
    const token = useSettingsStore(state => get(state, "token", null))
    const setUser = useStore(state => get(state, 'setUser', () => {
    }))

    const setAuth = useStore(state => get(state, 'setAuth', () => {
    }))
    const {data = null, isLoading, isFetching} = useGetAllQuery({
        key: KEYS.getMe,
        url: URLS.getMe,
        hideErrorMsg: true,
        params: {},
        enabled: !isNil(token),
        cb: {
            success: (response) => {
                setUser(response);
                setAuth(true)
            },
            fail:()=>{

            }
        }
    })


    if (isLoading) {
        return <OverlayLoader/>;
    }

    return (
        <>
            {children}
        </>
    );
};

export default Auth;