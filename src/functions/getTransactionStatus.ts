import axios from 'axios';
import { TransactionInfos } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';

export default async (transactionHash: string): Promise<TransactionInfos> => {
  const { confirmations, hash } = await axios.get(`${BLOCKCYPHER_BASE_URL}/txs/${transactionHash}`);
  return { confirmations, hash };
};
