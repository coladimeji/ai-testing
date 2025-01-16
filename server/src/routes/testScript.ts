import express from 'express';
import { TestScript } from '../models/TestScript';
import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

if (!process.env.OPENAI_API_KEY) {
  console.error('OpenAI API key is missing. Please check your .env file.');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate test script using OpenAI
router.post('/generate', async (req, res) => {
  try {
    const { url, language } = req.body;
    
    const prompt = `Generate a comprehensive test script in ${language} for the following URL: ${url}. Include unit tests and regression tests.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const generatedCode = completion.choices[0]?.message?.content || '';

    const testScript = new TestScript({
      name: `Test for ${url}`,
      description: `Automated test script for ${url}`,
      language,
      code: generatedCode,
    });

    await testScript.save();
    res.json(testScript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate test script' });
  }
});

// Get all test scripts
router.get('/', async (req, res) => {
  try {
    const testScripts = await TestScript.find().sort({ createdAt: -1 });
    res.json(testScripts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test scripts' });
  }
});

// Get a specific test script
router.get('/:id', async (req, res) => {
  try {
    const testScript = await TestScript.findById(req.params.id);
    if (!testScript) {
      return res.status(404).json({ error: 'Test script not found' });
    }
    res.json(testScript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test script' });
  }
});

export const testScriptRoutes = router; 