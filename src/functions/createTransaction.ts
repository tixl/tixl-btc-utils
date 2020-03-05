import axios from 'axios';
import { Transaction, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { getTransactionSender } from './shared';

export default async (fromAddress: string, toAddress: string, value: number): Promise<Transaction> => {
  const inputs = [{ addresses: [fromAddress] }];
  const transactionData = {
    inputs,
    outputs: [{ addresses: [toAddress], value }],
  };

  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  const { data: { tosign, tx } } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/new`, JSON.stringify(transactionData));
  return {
    sender,
    transactionData: tx,
    toSign: tosign,
  };
};
