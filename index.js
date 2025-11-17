const express = require('express');
const app = express();

port = 1337

app.get('/v1', (req, res) => {
    res.status(200).json({"test": "testing"});
})


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});