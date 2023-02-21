const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

app.get('/', req)

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

// get data
let studentData = require('./InitialData.js')

// GET requests
app.get('/api/student', (req, res) => {
    res.end(JSON.stringify(studentData))
})
app.get('/api/student/:id', (req, res) => {
    let studentId = parseInt(req.params.id)
    // finding student with correct id
    let student = studentData.filter(item => {
        if (item.id === studentId) {
            return item
        }
    })
    if (student.length === 0) {
        // no student found with matching id
        res.writeHead(400).end()
    } else {
        res.end(JSON.stringify(student[0]))
    }

})


// POST requests
app.post('/api/student', (req, res) => {
    let studentDetails = req.body, studentId = studentData.at(-1).id + 1
    // convert currentclass value to integer
    studentDetails = { ...studentDetails, currentClass: parseInt(studentDetails.currentClass) }
    studentData.push({ id: studentId, ...studentDetails })
    res.end(JSON.stringify({ 'id': studentId }))
})

// PUT requests
app.put('/api/student', (req, res) => {
    let studentDetails = req.body, studentId = parseInt(studentDetails.id)
    let studentIdList = studentData.map(item => item.id)
    if (studentIdList.includes(studentId)) {
        for (let i = 0; i < studentData.length; i++) {
            let student = studentData[i]
            if (student.id === studentId) {
                student = {
                    ...student,
                    ...studentDetails,
                    id: parseInt(studentDetails.id),
                    currentClass: parseInt(studentDetails.currentClass)
                }
                studentData[i] = student
                break
            }
            res.end(JSON.stringify({ "name": studentDetails.name }))
        }
    } else {
        res.writeHead(400).end()
    }

})

// DELETE requests
app.delete('/api/student/:id', (req, res) => {
    let studentId = parseInt(req.params.id)
    let studentIdList = studentData.map(item => item.id)
    if (studentIdList.includes(studentId)) {
        let studentIndex = 0
        for (let i = 0; i < studentData.length; i++) {
            if (studentId === studentData[i].id) {
                studentIndex = i
                break
            }
        }
        studentData.splice(studentIndex, 1)
        res.end()
    } else {
        res.writeHead(404).end()
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   