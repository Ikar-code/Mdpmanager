const express = require('express');
const router = express.Router();

// Vaults
const vaultsRouter = express.Router();
const { getAll, create, update, remove } = require('../controllers/vaults.controller');
vaultsRouter.get('/', getAll);
vaultsRouter.post('/', create);
vaultsRouter.put('/:id', update);
vaultsRouter.delete('/:id', remove);

// Users
const usersRouter = express.Router();
const { updateProfile, changePassword, getAuditLogs, deleteAccount } = require('../controllers/users.controller');
usersRouter.put('/profile', updateProfile);
usersRouter.put('/password', changePassword);
usersRouter.get('/audit-logs', getAuditLogs);
usersRouter.delete('/account', deleteAccount);

module.exports = { vaultsRouter, usersRouter };
