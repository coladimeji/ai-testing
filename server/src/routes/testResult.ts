import express from 'express';
import { TestResult } from '../models/TestResult';

const router = express.Router();

// Get all test results
router.get('/', async (req, res) => {
  try {
    const testResults = await TestResult.find()
      .populate('testScript')
      .sort({ createdAt: -1 });
    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// Get test results statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching test results statistics...');
    
    const [results, unitTestResults, regressionTestResults] = await Promise.all([
      TestResult.find(),
      TestResult.find({ testType: 'UNIT' }),
      TestResult.find({ testType: 'REGRESSION' })
    ]);

    console.log(`Found ${results.length} total results`);

    // If no results, return default stats
    if (results.length === 0) {
      return res.json({
        total: 0,
        passed: 0,
        failed: 0,
        unitTests: {
          total: 0,
          passed: 0,
          failed: 0,
        },
        regressionTests: {
          total: 0,
          passed: 0,
          failed: 0,
        },
        averageExecutionTime: 0
      });
    }

    const stats = {
      total: results.length,
      passed: results.filter(r => r.status === 'PASS').length,
      failed: results.filter(r => r.status === 'FAIL').length,
      unitTests: {
        total: unitTestResults.length,
        passed: unitTestResults.filter(r => r.status === 'PASS').length,
        failed: unitTestResults.filter(r => r.status === 'FAIL').length,
      },
      regressionTests: {
        total: regressionTestResults.length,
        passed: regressionTestResults.filter(r => r.status === 'PASS').length,
        failed: regressionTestResults.filter(r => r.status === 'FAIL').length,
      },
      averageExecutionTime: results.reduce((acc, curr) => acc + curr.executionTime, 0) / results.length
    };

    console.log('Stats calculated:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error calculating test result statistics:', error);
    res.status(500).json({ error: 'Failed to fetch test result statistics' });
  }
});

// Get test results for a specific test script
router.get('/script/:scriptId', async (req, res) => {
  try {
    const testResults = await TestResult.find({ testScript: req.params.scriptId })
      .populate('testScript')
      .sort({ createdAt: -1 });
    res.json(testResults);
  } catch (error) {
    console.error('Error fetching test results for script:', error);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

export const testResultRoutes = router; 