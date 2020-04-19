const express = require('express')
const expressGraphQl = require('express-graphql')
const schema = require('./src/schema')
const app = express();

app.use('/graphql', expressGraphQl({
    schema: schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('server running on : http://localhost:4000')
})