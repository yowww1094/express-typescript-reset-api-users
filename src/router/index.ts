import express from 'express';

import authnetication from './authnetication';
import users from './users';

const router = express.Router();

export default (): express.Router => {
    authnetication(router);
    users(router);

    return router;
};