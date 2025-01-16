import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Editor from '@monaco-editor/react';

interface TestResult {
  _id: string;
  testScript: {
    name: string;
    language: string;
  };
  status: 'PASS' | 'FAIL';
  executionTime: number;
  output: string;
  errorMessage?: string;
  testType: 'UNIT' | 'REGRESSION';
  createdAt: string;
}

const TestResults = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [exportFormat, setExportFormat] = useState('CSV');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test-results');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Failed to fetch test results:', error);
    }
  };

  const filteredResults = results.filter((result) => {
    if (filter === 'ALL') return true;
    if (filter === 'PASS') return result.status === 'PASS';
    if (filter === 'FAIL') return result.status === 'FAIL';
    if (filter === 'UNIT') return result.testType === 'UNIT';
    if (filter === 'REGRESSION') return result.testType === 'REGRESSION';
    return true;
  });

  const exportResults = (format: string) => {
    const data = filteredResults.map((result) => ({
      testName: result.testScript.name,
      status: result.status,
      testType: result.testType,
      executionTime: result.executionTime,
      date: new Date(result.createdAt).toLocaleDateString(),
    }));

    let content = '';
    if (format === 'CSV') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row) => Object.values(row).join(','));
      content = `${headers}\n${rows.join('\n')}`;
    } else if (format === 'JSON') {
      content = JSON.stringify(data, null, 2);
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test_results.${format.toLowerCase()}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Test Results</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="PASS">Passed</MenuItem>
              <MenuItem value="FAIL">Failed</MenuItem>
              <MenuItem value="UNIT">Unit Tests</MenuItem>
              <MenuItem value="REGRESSION">Regression</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Export As</InputLabel>
            <Select
              value={exportFormat}
              label="Export As"
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <MenuItem value="CSV">CSV</MenuItem>
              <MenuItem value="JSON">JSON</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => exportResults(exportFormat)}
          >
            Export
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Test Type</TableCell>
              <TableCell>Execution Time</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow
                key={result._id}
                sx={{
                  backgroundColor:
                    result.status === 'PASS'
                      ? 'success.main'
                      : 'error.main',
                  opacity: 0.1,
                }}
              >
                <TableCell>{result.testScript.name}</TableCell>
                <TableCell>{result.status}</TableCell>
                <TableCell>{result.testType}</TableCell>
                <TableCell>{result.executionTime}ms</TableCell>
                <TableCell>
                  {new Date(result.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      setSelectedResult(result);
                      setOpenDialog(true);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedResult?.testScript.name} - Test Result Details
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '60vh' }}>
            <Editor
              height="100%"
              defaultLanguage={selectedResult?.testScript.language.toLowerCase()}
              value={selectedResult?.output}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true,
              }}
            />
          </Box>
          {selectedResult?.errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              Error: {selectedResult.errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestResults; 