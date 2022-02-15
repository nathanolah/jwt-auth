import React from "react";
import { useByeQuery } from "../generated/graphql";

export const Bye = () => {
    const {data, loading, error} = useByeQuery({
        fetchPolicy: 'network-only' // everytime this page is visited a new request is made.
    });

    if (loading) {
        return <div>loading...</div>
    }

    if (error) {
        console.log(error)
        return <div>error</div>
    }

    if (!data) {
        return <div>no data</div>
    }

    return (
        <div>{data.bye}</div>
    );
}
