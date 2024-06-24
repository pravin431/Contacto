const express = require('express');
const { authenticateToken } = require('./middleware');
const {
    login,
    signUp,
    createContact,
    editContact,
    searchContact,
    fetchContacts,
    deleteContact
} = require('./controllers');

const router = express.Router();

router.post('/signup', signUp);     

router.post('/login', login);

router.post('/contacts/create', authenticateToken, createContact);
router.put('/contacts/edit', authenticateToken, editContact);
router.post('/contacts/search', authenticateToken, searchContact);
router.get('/contacts', authenticateToken, fetchContacts);
router.delete('/contacts/delete', authenticateToken, deleteContact);

module.exports = router;
