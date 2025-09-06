import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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


// Gemini LLM endpoint
app.post('/api/gemini', async (req, res) => {
  const { text, action } = req.body;
  console.log("receivedReq : ")
  console.log(text, action)
  let prompt = '';
  if (action === 'restructure') {
    prompt = `Restructure the following text to improve clarity and coherence:\n${text}`;
  } else if (action === 'highlight') {
    prompt = `Highlight the key points in the following text using markdown highlighter (mark tag):\n${text}`;
  } else {
    prompt = text;
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    // Gemini returns response.candidates[0].content.parts[0].text
    const result = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Resonponse success")
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Gemini API error' });
    console.log("Response Fail")
  }
});

app.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
