const express = require('express')
const users = require('./src/routes/users.js');
const app = express();

const port = process.env.PORT || 3001;

app.get('/v1/users', users.getUsers);

app.get('/v1/users/:id', users.specificUser);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});