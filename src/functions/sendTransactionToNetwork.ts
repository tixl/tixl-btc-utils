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
  const { data: { txs } } = result;
  if (txs.length === 0 || txs.length > 1) {
    throw new Error('This code can only deal with one tx at the moment');
  }
  const { confirmations, hash, inputs } = txs[0];
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  return { confirmations, hash, sender };
};
