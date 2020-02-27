import axios from 'axios';
import { Transaction } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';

export default async (fromAddress: string, toAddress: string, value: number): Promise<Transaction> => {
  const transactionData = {
    inputs: [{ addresses: [fromAddress] }],
    outputs: [{ addresses: [toAddress], value }],
  };

  const { tosign, tx } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/new`, JSON.stringify(transactionData));
  return {
    transactionData: tx,
    toSign: tosign,
  };
};
