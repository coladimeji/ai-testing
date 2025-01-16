import mongoose from 'mongoose';

export interface ITestScript {
  name: string;
  description: string;
  language: 'JavaScript' | 'Python' | 'Solidity';
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const testScriptSchema = new mongoose.Schema<ITestScript>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  language: { type: String, required: true, enum: ['JavaScript', 'Python', 'Solidity'] },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const TestScript = mongoose.model<ITestScript>('TestScript', testScriptSchema); 