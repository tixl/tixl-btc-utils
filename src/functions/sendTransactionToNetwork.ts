import { SignedTransaction, TransactionInfos } from '../types';
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
  const { data: { confirmations, hash, inputs, outputs } } = result;
  return { confirmations, hash, inputs, outputs };
};
