import mongoose from 'mongoose';

export interface ITestResult {
  testScript: mongoose.Types.ObjectId;
  status: 'PASS' | 'FAIL';
  executionTime: number;
  output: string;
  errorMessage?: string;
  testType: 'UNIT' | 'REGRESSION';
  createdAt: Date;
}

const testResultSchema = new mongoose.Schema<ITestResult>({
  testScript: { type: mongoose.Schema.Types.ObjectId, ref: 'TestScript', required: true },
  status: { type: String, required: true, enum: ['PASS', 'FAIL'] },
  executionTime: { type: Number, required: true },
  output: { type: String, required: true },
  errorMessage: { type: String },
  testType: { type: String, required: true, enum: ['UNIT', 'REGRESSION'] },
  createdAt: { type: Date, default: Date.now }
});

export const TestResult = mongoose.model<ITestResult>('TestResult', testResultSchema); 