import React, { useEffect, useState } from "react";
import { setAccessToken } from "./accessToken";
import AppRoutes from "./AppRoutes";

export const App = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8080/refresh_token', {
            method: 'POST',
            credentials: 'include'
        }).then(async x => {
            const { accessToken } = await x.json();
            setAccessToken(accessToken);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div>loading...</div>
    }

    return <AppRoutes />;
}