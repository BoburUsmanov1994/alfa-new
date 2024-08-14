import React from 'react';
import {isEmpty, includes} from "lodash";
import {OverlayLoader} from "../../components/loader";
import useAuth from "../../hooks/auth/useAuth";

export const hasPermission = (permissionList = [], can = [], cant = []) => {
    let hasPermission = false;
    can.forEach((permission) => {
        if (includes(permissionList, `${permission}`)) {
            hasPermission = true
        }
    })
    cant.forEach((permission) => {
        if (includes(permissionList, `${permission}`)) {
            hasPermission = false
        }
    })
    return hasPermission;
}
const HasAccess = ({
                       children,
                       access = [],
                       deny = [],
                       can = [],
                       cant = [],
                       DeniedComponent =()=> <></>
                   }) => {
    const {permissions} = useAuth()
    if (isEmpty(permissions)) {
        return <OverlayLoader/>
    }
    return (
        <>
            {hasPermission(permissions, can, cant) ? children : <DeniedComponent />}
        </>
    );
};

export default HasAccess;