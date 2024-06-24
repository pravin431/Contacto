# Contacto
Contacto is a simple contact management application that allows users to create, edit, delete, and search for contacts. It is built with Node.js and Express for the backend, MongoDB for the database. The project also implements user authentication using JWT tokens.

## Features

- User authentication with JWT tokens
- Create new contacts
- Edit existing contacts
- Delete contacts
- Search for contacts by name

## Technologies Used

- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)


## Installation

1. Clone the repository:

git clone https://github.com/pravin431/Contacto
Navigate to the project directory:
cd contacto

# Install the dependencies for the backend:

npm install

Create a .env file in the root directory and add the following environment variables:

PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

Usage
Start the backend server:
npm start

# API Endpoints
# Authentication
# Login
URL: /api/login
Method: POST
Body: { "username": "saltman", "password": "oai1122" }

# Contacts
Create Contact

URL: /api/contacts/create
Method: POST

Body: {"token":"<token>", "name": "John Doe", "phone": "1234567890", "email": "john@example.com", "linkedin": "johnlinkedin", "twitter": "johntwitter" }

# Edit Contact

URL: /api/contacts/edit
Method: PUT
Body: { "token":"<token>","id": "<contact_id>", "name": "Jane Doe", "phone": "0987654321", "email": "jane@example.com", "linkedin": "janelinkedin", "twitter": "janetwitter" }

# Delete Contact

URL: /api/contacts/delete
Method: DELETE
Body: {"token":"<token>", "id": "<contact_id>" }

# Search Contacts

URL: /api/contacts/search
Method: POST
Body: {"token":"<token>", "name": "John" }