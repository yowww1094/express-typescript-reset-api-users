import express from 'express';
import {get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        
        if (!currentUserId) {
            return res.status(403).json({message: "Cannot Preceed with operation!"});
        }

        if (currentUserId.toString() != id) {
            return res.status(403).json({message: "Cannot Proceed with operation!"});
        }

        return next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong!"});
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies["YOWW-AUTH"];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser =  await getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Something went wrong!"});
    }
}