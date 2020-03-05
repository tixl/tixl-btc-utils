import axios from 'axios';
import { TransactionInfos, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { getTransactionSender } from './shared';

export default async (transactionHash: string): Promise<TransactionInfos> => {
  const { data: { confirmations, hash, inputs } } = await axios.get(`${BLOCKCYPHER_BASE_URL}/txs/${transactionHash}`);
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  return { confirmations, hash, sender };
};
