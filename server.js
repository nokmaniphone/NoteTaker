const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

 //Must provide absolute path to sendFile even if you have static
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

//Returns all the notes in db.json
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (error, data) => {
    if (error) {
      console.error(error)
    }
    const notes = JSON.parse(data)
    res.json(notes)
  })
})

//POST to db.json
app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (error, data) => {
    if (error) {
      console.error(error)
    }
    const notes = JSON.parse(data)
    notes.push(req.body)
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), error => {
      if (error) {
        console.error(error)
      }
      res.sendStatus(200)
    })
  })
})

//Deleting the instance from array
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (error, data) => {
    if (error) {
      console.error(error)
    }
    const notes = JSON.parse(data)
  
    const index = notes.map(note => { return note.title }).indexOf(req.params.id)
    
    if (index === -1) {
      console.error(new Error('Note does not exist!'))
    }
    
    notes.splice(index, 1)
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), error => {
      if (error) {
        console.error(error)
      }
      res.sendStatus(200)
    })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(process.env.PORT || 3000)