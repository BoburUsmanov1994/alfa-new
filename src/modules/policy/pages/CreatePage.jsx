import React from 'react';
import CreateContainer from "../containers/CreateContainer";
import {useParams} from "react-router-dom";

const CreatePage = ({
                        ...rest
                    }) => {
    const {product_id} = useParams();
    return (
        <>
            <CreateContainer product_id={product_id} />
        </>
    );
};

export default CreatePage;