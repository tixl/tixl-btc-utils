import { ReceivedFunds, TransactionInputOrOutput } from '../types';
import { functions } from '../firebase';

/**
 * Returns all funds that have been sent to `toAddress` in the transaction identified by the `transactionHash`
 */
export default async (toAddress: string, transactionHash: string): Promise<ReceivedFunds|null> => {
  const getTransaction = functions.httpsCallable('getTransaction');
  const { data } = await getTransaction({ transactionHash });
  let fundsValue = 0;
  data.outputs.forEach((output: TransactionInputOrOutput) => {
    if ((output.addresses || []).includes(toAddress)) {
      fundsValue += output.value;
    }
  });

  if (fundsValue <= 0) {
    return null;
  }

  return {
    confirmations: data.confirmations,
    transactionHash: data.hash,
    value: fundsValue,
  };
}
