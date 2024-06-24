const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Contact, User } = require('./models');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.SECRET_KEY;
const encryptionSecret = process.env.ENCRYPTION_SECRET;

// login via user credentials
// const login = async (req, res) => {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });

//     if (!user || user.password !== password) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
//     res.json({ token });
// };

// login via dummy credentials
const login = (req, res) => {
    const { username, password } = req.body;

    // Dummy credentials
    const dummyUsername = 'saltman';
    const dummyPassword = 'oai1122';

    if (username === dummyUsername && password === dummyPassword) {
        // Generate a JWT token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
};

// sign up function to create new user
const signUp = async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
};

const createContact = async (req, res) => {
    const { name, phone, email, linkedin, twitter } = req.body;

    const encryptedPhone = CryptoJS.AES.encrypt(phone.toString(), encryptionSecret).toString();
    const encryptedEmail = email ? CryptoJS.AES.encrypt(email, encryptionSecret).toString() : null;
    const encryptedLinkedin = linkedin ? CryptoJS.AES.encrypt(linkedin, encryptionSecret).toString() : null;
    const encryptedTwitter = twitter ? CryptoJS.AES.encrypt(twitter, encryptionSecret).toString() : null;

    const newContact = new Contact({
        id: uuidv4(),
        name,
        phone: encryptedPhone,
        email: encryptedEmail,
        linkedin: encryptedLinkedin,
        twitter: encryptedTwitter
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact created successfully' });
};

const editContact = async (req, res) => {
    const { name, phone, email, linkedin, twitter } = req.body;

    const contact = await Contact.findOne({ name });

    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    if (phone) {
        contact.phone = CryptoJS.AES.encrypt(phone.toString(), encryptionSecret).toString();
    }
    if (email) {
        contact.email = CryptoJS.AES.encrypt(email, encryptionSecret).toString();
    }
    if (linkedin) {
        contact.linkedin = CryptoJS.AES.encrypt(linkedin, encryptionSecret).toString();
    }
    if (twitter) {
        contact.twitter = CryptoJS.AES.encrypt(twitter, encryptionSecret).toString();
    }

    await contact.save();
    res.status(200).json({ message: 'Contact updated successfully' });
};

const searchContact = async (req, res) => {
    const { token, name } = req.body;

    try {
        // Verify token
        jwt.verify(token, secretKey, async (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });

            // Use regex for partial matching on the plaintextName field
            const regex = new RegExp(name, 'i'); // 'i' makes the search case-insensitive
            const contacts = await Contact.find({ name: { $regex: regex } });

            if (contacts.length === 0) {
                return res.status(404).json({ message: 'No contacts found' });
            }

            const decryptedContacts = contacts.map(contact => ({
                id: contact.id,
                name: contact.name,
                phone: CryptoJS.AES.decrypt(contact.phone, 'encryptionSecret').toString(CryptoJS.enc.Utf8),
                email: contact.email ? CryptoJS.AES.decrypt(contact.email, 'encryptionSecret').toString(CryptoJS.enc.Utf8) : null,
                linkedin: contact.linkedin ? CryptoJS.AES.decrypt(contact.linkedin, 'encryptionSecret').toString(CryptoJS.enc.Utf8) : null,
                twitter: contact.twitter ? CryptoJS.AES.decrypt(contact.twitter, 'encryptionSecret').toString(CryptoJS.enc.Utf8) : null
            }));

            res.json(decryptedContacts);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching contacts', error });
    }
};


const fetchContacts = async (req, res) => {
    const contacts = await Contact.find();
    const decryptedContacts = contacts.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: CryptoJS.AES.decrypt(contact.phone, encryptionSecret).toString(CryptoJS.enc.Utf8),
        email: contact.email ? CryptoJS.AES.decrypt(contact.email, encryptionSecret).toString(CryptoJS.enc.Utf8) : null,
        linkedin: contact.linkedin ? CryptoJS.AES.decrypt(contact.linkedin, encryptionSecret).toString(CryptoJS.enc.Utf8) : null,
        twitter: contact.twitter ? CryptoJS.AES.decrypt(contact.twitter, encryptionSecret).toString(CryptoJS.enc.Utf8) : null
    }));
    res.json(decryptedContacts);
};

// delete contact by using id from body
// const deleteContact = async (req, res) => {
//     const { id } = req.body;

//     const contact = await Contact.findByIdAndDelete(id);

//     if (!contact) {
//         return res.status(404).json({ message: 'Contact not found' });
//     }

//     res.status(200).json({ message: 'Contact deleted successfully' });
// };

// delete contact by name
const deleteContact = async (req, res) => {
    const { token, name } = req.body;

    try {
        // Verify token
        jwt.verify(token, secretKey, async (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token' });

            // Find and delete the contact by name
            const deletedContact = await Contact.findOneAndDelete({ name });

            if (!deletedContact) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            res.json({ message: 'Contact deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error });
    }
};

module.exports = {
    login,
    signUp,
    createContact,
    editContact,
    searchContact,
    fetchContacts,
    deleteContact
};
