import React from 'react';
import {useParams} from "react-router-dom";
import EndorsementCreateContainer from "../containers/EndorsementCreateContainer";

const EndorsementCreatePage = ({
                        ...rest
                    }) => {
    const {product_id} = useParams();
    return (
        <>
            <EndorsementCreateContainer product_id={product_id} />
        </>
    );
};

export default EndorsementCreatePage;