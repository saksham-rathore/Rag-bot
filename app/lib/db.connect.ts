import { Pinecone } from '@pinecone-database/pinecone';
import mongoose from 'mongoose';

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});
const index = pc.index('quickstart');