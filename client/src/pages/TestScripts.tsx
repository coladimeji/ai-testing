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
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel
} from '@mui/material';
import Editor from '@monaco-editor/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeIcon from '@mui/icons-material/Code';
import AddIcon from '@mui/icons-material/Add';

interface TestScript {
  _id: string;
  name: string;
  description: string;
  language: string;
  code: string;
  createdAt: string;
}

const TestScripts = () => {
  const [scripts, setScripts] = useState<TestScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<TestScript | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openNewTestDialog, setOpenNewTestDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New test form state
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('JavaScript');
  const [testType, setTestType] = useState<'UNIT' | 'REGRESSION'>('UNIT');
  const [framework, setFramework] = useState('Jest');
  const [viewport, setViewport] = useState('desktop');
  const [captureScreenshots, setCaptureScreenshots] = useState(true);
  const [mockNetwork, setMockNetwork] = useState(true);
  const [aiFeatures, setAiFeatures] = useState({
    cognitiveAnalysis: {
      enabled: true,
      nlpValidation: true,
      semanticAnalysis: true,
      behaviorValidation: true,
      intentVerification: true,
      cognitiveLoad: true
    },
    predictiveModeling: {
      enabled: true,
      testPrioritization: true,
      failureAnalysis: true,
      riskBasedSelection: true,
      coverageOptimization: true
    },
    anomalyDetection: {
      enabled: true,
      behaviorAnalysis: true,
      performanceAnomalies: true,
      uiInconsistencies: true,
      dataAnomalies: true
    },
    smartHealing: {
      enabled: true,
      domAnalysis: true,
      selectorEvolution: true,
      visualMatching: true,
      contextAwareRecovery: true
    },
    userSimulation: {
      enabled: true,
      naturalBehavior: true,
      errorProbability: true,
      deviceSpecific: true,
      multiUser: true
    },
    securityAnalysis: {
      enabled: true,
      vulnerabilityDetection: true,
      complianceValidation: true,
      attackSimulation: true,
      dataSecurityVerification: true
    },
    performanceOptimization: {
      enabled: true,
      mlPrediction: true,
      resourceOptimization: true,
      bottleneckDetection: true,
      scalabilityAnalysis: true
    },
    accessibilityIntelligence: {
      enabled: true,
      wcagCompliance: true,
      screenReader: true,
      colorContrast: true,
      navigationOptimization: true
    },
    visualIntelligence: {
      enabled: true,
      deepLearningComparison: true,
      layoutStability: true,
      responsiveDesign: true,
      visualHierarchy: true
    },
    dataIntelligence: {
      enabled: true,
      contextAware: true,
      relationshipPreservation: true,
      edgeCaseGeneration: true,
      businessRules: true
    }
  });

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/test-scripts');
      const data = await response.json();
      setScripts(data);
    } catch (error) {
      console.error('Failed to fetch test scripts:', error);
      setError('Failed to fetch test scripts');
    }
  };

  const handleRunTest = async (scriptId: string, testType: 'UNIT' | 'REGRESSION') => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/test-execution/run/${scriptId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType, framework }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to run test');
      }

      const result = await response.json();
      // Redirect to test results page or show success message
      window.location.href = '/test-results';
    } catch (error) {
      console.error('Failed to run test:', error);
      setError('Failed to run test');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAndRunTest = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/api/test-execution/generate-and-run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          language,
          testType,
          framework,
          viewport,
          captureScreenshots,
          mockNetwork,
          aiFeatures: testType === 'REGRESSION' ? {
            ...aiFeatures,
            viewport,
            captureScreenshots,
            mockNetwork
          } : undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate and run test');
      }

      const result = await response.json();
      setOpenNewTestDialog(false);
      await fetchScripts(); // Refresh the list
      window.location.href = '/test-results'; // Redirect to results page
    } catch (error: any) {
      console.error('Failed to generate and run test:', error);
      setError(error.message || 'Failed to generate and run test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Test Scripts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewTestDialog(true)}
        >
          Generate New Test
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Language</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scripts.map((script) => (
              <TableRow key={script._id}>
                <TableCell>{script.name}</TableCell>
                <TableCell>{script.description}</TableCell>
                <TableCell>{script.language}</TableCell>
                <TableCell>
                  {new Date(script.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<CodeIcon />}
                      onClick={() => {
                        setSelectedScript(script);
                        setOpenDialog(true);
                      }}
                    >
                      View Code
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleRunTest(script._id, 'UNIT')}
                      disabled={loading}
                    >
                      Run Unit Test
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      startIcon={<PlayArrowIcon />}
                      onClick={() => handleRunTest(script._id, 'REGRESSION')}
                      disabled={loading}
                    >
                      Run Regression
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Code Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedScript?.name} - Test Script
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: '60vh' }}>
            <Editor
              height="100%"
              defaultLanguage={selectedScript?.language.toLowerCase()}
              value={selectedScript?.code}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Generate New Test Dialog */}
      <Dialog
        open={openNewTestDialog}
        onClose={() => setOpenNewTestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Generate Automated Test</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Application URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter the URL to test"
            />
            <FormControl fullWidth>
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
            {language === 'JavaScript' && (
              <FormControl fullWidth>
                <InputLabel>Framework</InputLabel>
                <Select
                  value={framework}
                  label="Framework"
                  onChange={(e) => setFramework(e.target.value)}
                >
                  <MenuItem value="Jest">Jest</MenuItem>
                  <MenuItem value="Mocha">Mocha</MenuItem>
                </Select>
              </FormControl>
            )}
            <FormControl fullWidth>
              <InputLabel>Test Type</InputLabel>
              <Select
                value={testType}
                label="Test Type"
                onChange={(e) => setTestType(e.target.value as 'UNIT' | 'REGRESSION')}
              >
                <MenuItem value="UNIT">Unit Test</MenuItem>
                <MenuItem value="REGRESSION">Regression Test</MenuItem>
              </Select>
            </FormControl>
            
            {testType === 'REGRESSION' && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Viewport</InputLabel>
                  <Select
                    value={viewport}
                    label="Viewport"
                    onChange={(e) => setViewport(e.target.value)}
                  >
                    <MenuItem value="desktop">Desktop (1920x1080)</MenuItem>
                    <MenuItem value="tablet">Tablet (768x1024)</MenuItem>
                    <MenuItem value="mobile">Mobile (375x667)</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Advanced AI Testing Features</Typography>
                
                {/* Cognitive Analysis */}
                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box>
                      <Typography variant="subtitle2">Cognitive Analysis</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Advanced NLP and semantic understanding for intelligent testing
                      </Typography>
                      <Box sx={{ pl: 2, mt: 1 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={aiFeatures.cognitiveAnalysis.enabled}
                              onChange={(e) => setAiFeatures(prev => ({
                                ...prev,
                                cognitiveAnalysis: {
                                  ...prev.cognitiveAnalysis,
                                  enabled: e.target.checked
                                }
                              }))}
                            />
                          }
                          label="Enable Cognitive Analysis"
                        />
                        {aiFeatures.cognitiveAnalysis.enabled && (
                          <Box sx={{ pl: 2 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={aiFeatures.cognitiveAnalysis.nlpValidation}
                                  onChange={(e) => setAiFeatures(prev => ({
                                    ...prev,
                                    cognitiveAnalysis: {
                                      ...prev.cognitiveAnalysis,
                                      nlpValidation: e.target.checked
                                    }
                                  }))}
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="body2">NLP Validation</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    Natural language processing for content validation
                                  </Typography>
                                </Box>
                              }
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={aiFeatures.cognitiveAnalysis.semanticAnalysis}
                                  onChange={(e) => setAiFeatures(prev => ({
                                    ...prev,
                                    cognitiveAnalysis: {
                                      ...prev.cognitiveAnalysis,
                                      semanticAnalysis: e.target.checked
                                    }
                                  }))}
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="body2">Semantic Analysis</Typography>
                                  <Typography variant="caption" color="textSecondary">
                                    Deep understanding of UI elements and their relationships
                                  </Typography>
                                </Box>
                              }
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Self-Healing Tests</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Automatically fix broken selectors and test steps
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.selfHealing.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        selfHealing: {
                          ...prev.selfHealing,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>AI Visual Validation</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Intelligent visual regression testing
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.visualValidation.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        visualValidation: {
                          ...prev.visualValidation,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Dynamic Test Data</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Context-aware test data generation
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.dynamicData.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        dynamicData: {
                          ...prev.dynamicData,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Performance Analysis</Typography>
                      <Typography variant="caption" color="textSecondary">
                        AI-driven performance testing and analysis
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.performanceAnalysis.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        performanceAnalysis: {
                          ...prev.performanceAnalysis,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Error Prediction</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Predict and prevent potential test failures
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.errorPrediction.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        errorPrediction: {
                          ...prev.errorPrediction,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Adaptive Wait Times</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Smart waiting based on application state
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.adaptiveWaits.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        adaptiveWaits: {
                          ...prev.adaptiveWaits,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography>Intelligent Retry</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Smart retry logic for flaky tests
                      </Typography>
                    </Box>
                    <Switch
                      checked={aiFeatures.intelligentRetry.enabled}
                      onChange={(e) => setAiFeatures(prev => ({
                        ...prev,
                        intelligentRetry: {
                          ...prev.intelligentRetry,
                          enabled: e.target.checked
                        }
                      }))}
                    />
                  </Box>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Additional Features</Typography>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Capture Screenshots on Failure</Typography>
                    <Switch
                      checked={captureScreenshots}
                      onChange={(e) => setCaptureScreenshots(e.target.checked)}
                    />
                  </Box>
                </FormControl>

                <FormControl fullWidth>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>Mock Network Requests</Typography>
                    <Switch
                      checked={mockNetwork}
                      onChange={(e) => setMockNetwork(e.target.checked)}
                    />
                  </Box>
                </FormControl>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewTestDialog(false)}>Cancel</Button>
          <Button
            onClick={handleGenerateAndRunTest}
            variant="contained"
            disabled={!url || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate & Run Automated Test'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestScripts; 