import express from 'express';
import { TestScript } from '../models/TestScript';
import { TestResult } from '../models/TestResult';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import path from 'path';
import OpenAI from 'openai';

const execAsync = promisify(exec);
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateTestScript = async (url: string, language: string, testType: 'UNIT' | 'REGRESSION', framework?: string, aiFeatures?: any) => {
  try {
    console.log(`Generating ${testType} test for ${url} using ${language} and ${framework}`);
    
    const prompt = `Generate a ${testType.toLowerCase()} test script in ${language}${framework ? ` using ${framework}` : ''} for the URL: ${url}.
    Include proper imports, setup, and teardown.
    ${testType === 'UNIT' ? `
    Include:
    - Component testing
    - Function testing
    - State management testing
    - Error handling
    - Mock API calls
    ` : `
    Include:
    - End-to-end user flow testing
    - UI element verification
    - Form submission testing
    - Navigation testing
    - API integration testing
    `}
    Return only the executable test code.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert test automation engineer. Generate practical, executable test code."
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const code = completion.choices[0]?.message?.content || '';
    if (!code) {
      throw new Error('Failed to generate test code');
    }

    return code;
  } catch (error) {
    console.error('Error generating test script:', error);
    throw error;
  }
};

const executeTest = async (code: string, language: string, framework: string) => {
  try {
    const tempDir = path.join(__dirname, '../temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const filename = `test_${Date.now()}.${language.toLowerCase() === 'javascript' ? 'js' : 'py'}`;
    const filePath = path.join(tempDir, filename);

    // Add framework-specific imports
    let finalCode = code;
    if (language === 'JavaScript') {
      if (framework === 'Mocha') {
        finalCode = `const { describe, it } = require('mocha');\nconst { expect } = require('chai');\n${code}`;
      } else {
        finalCode = `const { test, expect } = require('@jest/globals');\n${code}`;
      }
    }

    await fs.writeFile(filePath, finalCode);
    console.log(`Test file created at: ${filePath}`);

    let output: string;
    let status: 'PASS' | 'FAIL' = 'PASS';
    let errorMessage: string | undefined;

    try {
      if (language === 'JavaScript') {
        if (framework === 'Mocha') {
          const { stdout } = await execAsync(`yarn mocha ${filePath} --reporter json`);
          output = stdout;
          const result = JSON.parse(stdout);
          status = result.failures === 0 ? 'PASS' : 'FAIL';
        } else {
          const { stdout } = await execAsync(`yarn jest ${filePath} --json`);
          output = stdout;
          const result = JSON.parse(stdout);
          status = result.numFailedTests === 0 ? 'PASS' : 'FAIL';
        }
      } else {
        throw new Error('Unsupported language');
      }
    } catch (error: any) {
      status = 'FAIL';
      output = error.stdout || '';
      errorMessage = error.stderr || error.message;
      console.error('Test execution error:', error);
    }

    await fs.unlink(filePath);
    return { output, status, errorMessage };
  } catch (error) {
    console.error('Error executing test:', error);
    throw error;
  }
};

// Generate and run test
router.post('/generate-and-run', async (req, res) => {
  try {
    const { url, language, testType, framework = 'Jest' } = req.body;

    if (!url || !language || !testType) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log('Generating test script...');
    const code = await generateTestScript(url, language, testType, framework);

    // Save test script
    const testScript = new TestScript({
      name: `${testType} Test for ${url}`,
      description: `Generated ${testType.toLowerCase()} test for ${url}`,
      language,
      code,
      framework
    });

    await testScript.save();
    console.log('Test script saved');

    // Execute the test
    console.log('Executing test...');
    const { output, status, errorMessage } = await executeTest(code, language, framework);

    const testResult = new TestResult({
      testScript: testScript._id,
      status,
      executionTime: 0,
      output,
      errorMessage,
      testType
    });

    await testResult.save();
    console.log('Test result saved');

    res.json({
      testScript,
      testResult
    });
  } catch (error: any) {
    console.error('Error in generate-and-run:', error);
    res.status(500).json({ 
      error: 'Failed to generate and run test',
      details: error.message
    });
  }
});

// Execute existing test
router.post('/run/:id', async (req, res) => {
  try {
    const { testType, framework = 'Jest' } = req.body;
    const testScript = await TestScript.findById(req.params.id);
    
    if (!testScript) {
      return res.status(404).json({ error: 'Test script not found' });
    }

    const { output, status, errorMessage } = await executeTest(
      testScript.code,
      testScript.language,
      framework
    );

    const testResult = new TestResult({
      testScript: testScript._id,
      status,
      executionTime: 0,
      output,
      errorMessage,
      testType
    });

    await testResult.save();

    res.json(testResult);
  } catch (error: any) {
    console.error('Error executing test:', error);
    res.status(500).json({ 
      error: 'Failed to execute test',
      details: error.message
    });
  }
});

export const testExecutionRoutes = router; 