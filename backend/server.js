// server.js
import express from 'express';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import sql from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Registration
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (existing.length > 0) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (username, password)
      VALUES (${username}, ${hashedPassword})
    `;

    res.send('Account created! Click here to login');
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Login
app.post('/login', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const results =
      await sql`SELECT * FROM users WHERE username = ${username.trim()}`;
    if (results.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({ success: true, role, username });
    } else {
      res.status(400).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Server error: ' + err.message);
  }
});

// Book Appointment
app.post('/appointments', async (req, res) => {
  const { patient, doctor, date, slot, username } = req.body;

  try {
    await sql`
      INSERT INTO appointments (patient, doctor, date, slot, username)
      VALUES (${patient}, ${doctor}, ${date}, ${slot}, ${username})
    `;
    res.json({ success: true, message: 'Appointment booked successfully!' });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Get User Appointments
app.get('/appointments', async (req, res) => {
  const { username } = req.query;

  try {
    if (username) {
      const appointments =
        await sql`SELECT patient, doctor, date, slot FROM appointments WHERE username = ${username}`;
      res.json(appointments);
    } else {
      const appointments =
        await sql`SELECT patient, doctor, date, slot FROM appointments`;
      res.json(appointments);
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
