import { TransactionInfos, TransactionInputOrOutput } from '../types';
import { getTransactionSender } from './shared';
import { functions } from '../firebase';

export default async (transactionHash: string): Promise<TransactionInfos> => {
  const getTransaction = functions.httpsCallable('getTransaction');
  const { data: { confirmations, hash, inputs } } = await getTransaction({ transactionHash });
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  return { confirmations, hash, sender };
};
