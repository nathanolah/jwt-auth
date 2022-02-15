import { Response } from 'express';

export const sendRefreshToken = (res: Response, token: string) => {
    // Create a cookie and store a refresh token
    res.cookie('jid', token, 
        {
            httpOnly: true, // this cannot be accessed by JavaScript, http only.
            path: '/refresh_token' 
        }
    );
}