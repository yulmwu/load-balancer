const express = require('express')
const app = express()
const port = process.argv[2] || 3000

app.get('/', (req, res) => {
    res.send(`Response from backend server at port <h1>${port}</h1>`)
})

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`)
})
