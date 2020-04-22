import { SignedTransaction, TransactionInfos, TransactionInputOrOutput } from '../types';
import { getTransactionSender } from './shared';
import { functions } from '../firebase';

export default async (transaction: SignedTransaction): Promise<TransactionInfos> => {
  const { publicKeys, signatures, toSign, transactionData } = transaction;
  const sendTransaction = functions.httpsCallable('sendTransaction');
  const result = await sendTransaction({
    publicKeys,
    signatures,
    toSign,
    transactionData,
  });
  const { data: { confirmations, hash, inputs } } = result;
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  return { confirmations, hash, sender };
};
