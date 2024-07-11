import React from 'react';
import {useMutation, useQueryClient} from 'react-query'
import {request} from "../../services/api";
import {toast} from "react-toastify";
import {forEach, isArray} from "lodash";

const postRequest = (url, attributes, config = {}) => request.post(url, attributes, config);

const usePostQuery = ({hideSuccessToast = false, listKeyId = null}) => {


        const queryClient = useQueryClient();

        const {mutate, isLoading, isError, error, isFetching} = useMutation(
            ({
                 url,
                 attributes,
                 config = {}
             }) => postRequest(url, attributes, config),
            {
                onSuccess: (data) => {
                    if (!hideSuccessToast) {
                        toast.success(data?.data?.message || 'SUCCESS')
                    }

                    if (listKeyId) {
                        if(isArray(listKeyId)){
                            forEach(listKeyId,(_keyId)=>{
                                queryClient.invalidateQueries(_keyId)
                            })
                        }else {
                            queryClient.invalidateQueries(listKeyId)
                        }
                    }
                },
                onError: (data) => {
                    if (isArray(data?.response?.data?.message)) {
                        forEach(data?.response?.data?.message, (_item) => {
                            toast.error(_item)
                        })
                    } else {
                        toast.error(data?.response?.data?.message || data?.response?.data?.error || data?.response?.data?.message?.[0] || data?.message || 'ERROR')
                    }
                }
            }
        );

        return {
            mutate,
            isLoading,
            isError,
            error,
            isFetching,
        }
    }
;

export default usePostQuery;