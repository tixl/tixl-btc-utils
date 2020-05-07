import { TransactionInfos } from '../types';
import { functions } from '../firebase';

export default async (transactionHash: string): Promise<TransactionInfos> => {
  const getTransaction = functions.httpsCallable('getTransaction');
  const { data: { confirmations, hash, inputs, outputs } } = await getTransaction({ transactionHash });
  return { confirmations, hash, inputs, outputs };
};
