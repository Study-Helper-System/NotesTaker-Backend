import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://root:example@localhost:27017/notes_taker?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Note = mongoose.model('Note', noteSchema);

// Get all notes
app.get('/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Get a single note
app.get('/notes/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  res.json(note);
});

// Create a new note
app.post('/notes', async (req, res) => {
  const { title, content } = req.body;
  const note = new Note({ title, content });
  await note.save();
  res.json(note);
});

// Update a note
app.put('/notes/:id', async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  res.json(note);
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});


// Gemini LLM endpoint (mocked)
app.post('/api/gemini', async (req, res) => {
  const { text, action } = req.body;
  let result = text;
  if (action === 'restructure') {
    // Mock: reverse the text as a placeholder for restructuring
    result = text.split('').reverse().join('');
  } else if (action === 'highlight') {
    // Mock: wrap the text in ** for markdown highlight
    result = `**${text}**`;
  }
  // TODO: Replace above logic with Gemini LLM API call
  res.json({ result });
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
