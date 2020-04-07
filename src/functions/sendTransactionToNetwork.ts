import axios from 'axios';
import { SignedTransaction, TransactionInfos, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { getTransactionSender } from './shared';

export default async (transaction: SignedTransaction): Promise<TransactionInfos> => {
  const { publicKeys, signatures, toSign, transactionData } = transaction;
  const result = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/send`, JSON.stringify({
    pubkeys: publicKeys,
    signatures,
    tosign: toSign,
    tx: transactionData,
  }));
  console.info(JSON.stringify(result.data));
  const { data: { confirmations, hash, inputs } } = result;
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  return { confirmations, hash, sender };
};
