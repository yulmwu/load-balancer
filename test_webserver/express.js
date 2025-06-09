const express = require('express')
const app = express()
const port = process.argv[2] || 3000

app.get('/', (req, res) => {
    res.send(`Hello, World! on ${port} port`)
})

app.get('/:name', (req, res) => {
    const name = req.params.name
    res.send(`Hello, ${name}! on ${port} port`)
})

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`)
})
