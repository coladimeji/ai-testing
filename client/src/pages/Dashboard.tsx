import { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box, Alert, CircularProgress } from '@mui/material';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  unitTests: {
    total: number;
    passed: number;
    failed: number;
  };
  regressionTests: {
    total: number;
    passed: number;
    failed: number;
  };
  averageExecutionTime: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:3000/api/test-results/stats');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box p={2}>
        <Alert severity="info">No test data available yet. Start by creating and running some tests!</Alert>
      </Box>
    );
  }

  const pieData = {
    labels: ['Passed', 'Failed'],
    datasets: [
      {
        data: [stats.passed, stats.failed],
        backgroundColor: ['#4caf50', '#f44336'],
      },
    ],
  };

  const barData = {
    labels: ['Unit Tests', 'Regression Tests'],
    datasets: [
      {
        label: 'Passed',
        data: [stats.unitTests.passed, stats.regressionTests.passed],
        backgroundColor: '#4caf50',
      },
      {
        label: 'Failed',
        data: [stats.unitTests.failed, stats.regressionTests.failed],
        backgroundColor: '#f44336',
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Overall Statistics
            </Typography>
            <Typography>Total Tests: {stats.total}</Typography>
            <Typography>Passed: {stats.passed}</Typography>
            <Typography>Failed: {stats.failed}</Typography>
            <Typography>
              Average Execution Time: {stats.averageExecutionTime.toFixed(2)}ms
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Test Results Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Test Types Comparison
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 