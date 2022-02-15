import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';

interface Props {}

export const Register: React.FC<Props> = () => {
    let navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register] = useRegisterMutation();

    const handleSubmit = async (e : any) => {
        e.preventDefault();
        console.log('form submitted');
        // console.log(email, password);

        const response = await register({
            variables: {
                email,
                password
            }
        });

        console.log(response);
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
            <button type="submit">Register</button>
        </form>
    );
}