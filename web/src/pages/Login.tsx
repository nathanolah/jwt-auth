import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../accessToken';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

interface Props {

}

export const Login: React.FC<Props> = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login] = useLoginMutation();

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        console.log('form submitted');
        // console.log(email, password);

        const response = await login({
            variables: {
                email,
                password
            },
            update: (store, { data }) => { 
                if (!data) {
                    return null;
                }

                // update the apollo cache
                store.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                        me: data.login.user
                    } 
                });
            }
        });

        console.log(response);

        if (response && response.data) {
            setAccessToken(response.data.login.accessToken);
        }


        // Navigate back to home page
        navigate('/');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input 
                    value={email}
                    placeholder='email'
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input 
                    type="password"
                    value={password}
                    placeholder='password'
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}