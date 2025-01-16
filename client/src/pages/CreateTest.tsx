import { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Paper } from '@mui/material';
import Editor from '@monaco-editor/react';

const CreateTest = () => {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/test-scripts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, language }),
      });

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error('Failed to generate test script:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Test Script
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label="Application URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter the URL of the application to test"
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              <MenuItem value="JavaScript">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="Solidity">Solidity</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!url || loading}
          >
            {loading ? 'Generating...' : 'Generate Test Script'}
          </Button>
        </Box>
      </Paper>

      {generatedCode && (
        <Paper sx={{ height: '60vh' }}>
          <Editor
            height="100%"
            defaultLanguage={language.toLowerCase()}
            value={generatedCode}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              readOnly: true,
            }}
          />
        </Paper>
      )}
    </Box>
  );
};

export default CreateTest; 