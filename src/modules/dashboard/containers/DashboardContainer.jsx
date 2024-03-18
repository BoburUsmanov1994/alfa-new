import React, {useEffect} from 'react';
import {useQuery} from "react-query";
import {request} from "../../../services/api";
import config from "../../../config";

const DashboardContainer = ({...rest}) => {

    // useEffect(()=>{
    //     fetch('https://jsonplaceholder.typicode.com/posts/1')
    //         .then((response) => response.json())
    //         .then((json) => console.log(json))
    // },[])
    console.log('test')
    return (
        <div>
            Dashboard page
        </div>
    );
};

export default DashboardContainer;