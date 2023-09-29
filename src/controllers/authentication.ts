import { createUser, getUserbyEmail } from '../db/users';
import express from 'express';
import { authentication, random } from '../helpers/index';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "No data received!"});
        }

        const user = await getUserbyEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.status(400).json({message: "E-mail does not exist!"});
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.status(403).json({message: "Wrong E-mail or Password!"});
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('YOWW-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, username, password } = req.body;
        if (!email || !username || !password) {
            return res.status(400).json({message: "No data received!"});
        }

        const existingUser = await getUserbyEmail(email);

        if (existingUser) {
            return res.status(400).json({message: "E-mail already exist!"});
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong'});
    }
}