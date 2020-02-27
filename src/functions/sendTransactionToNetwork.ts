import axios from 'axios';
import { SignedTransaction, TransactionInfos } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';

export default async (transaction: SignedTransaction): Promise<TransactionInfos> => {
  const { publicKeys, signatures, toSign, transactionData } = transaction;
  const { confirmations, hash } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/send`, JSON.stringify({
    pubkeys: publicKeys,
    signatures,
    tosign: toSign,
    tx: transactionData,
  }));
  return { confirmations, hash };
};
