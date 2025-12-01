const app = require('./src/app.js')
const users = require('./src/routes/users.js')

const port = 3000

app.get('/v1/users', users.getUsers)


app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});