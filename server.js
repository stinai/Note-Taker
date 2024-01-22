const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const htmlRoutes = require('./routes/htmlRoutes');
const fs = require("fs").promises;
const path = require("path");
const uuid = require("uuid");
const Notes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const dbPath = path.join(__dirname, './db/db.json');

app.get('/api/notes', async (req, res) => {
  try {
      const data = await fs.readFile(dbPath, 'utf-8');
      const notes = JSON.parse(data);
      return res.json(notes);
  } catch (error) {
      console.error('Error reading notes:', error);
      return res.status(500).json({ error: 'Unable to retrieve notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
      const userNote = {
          id: uuid.v4(),
          title: req.body.title,
          text: req.body.text,
      };

      // Read existing notes
      const data = await fs.readFile(dbPath, 'utf-8');
      const notes = JSON.parse(data);

      // Add the new note to the array
      notes.push(userNote);

      // Write the updated notes back to the file
      await fs.writeFile(dbPath, JSON.stringify(notes, null, 2), 'utf-8');

      return res.json(userNote);
  } catch (error) {
      console.error('Error saving note:', error);
      return res.status(500).json({ error: 'Unable to save note' });
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const notes = JSON.parse(data);

    const noteData = notes.findIndex((note) => note.id === req.params.id);

    if (noteData !== -1) {
      notes.splice(noteData, 1);
      await fs.writeFile(dbPath, JSON.stringify(notes, null, 2), 'utf-8');

      return res.status(200).json({ message: 'Note deleted succesfully.' });
    } else {
      return res.status(404).json({ message: 'No notes with this id'});
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({ error: 'Unable to delete note' });
  }
  
});

app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}. Welcome!`);
  });