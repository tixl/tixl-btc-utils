import { EmbeddedTransaction, ReceivedFunds, TransactionInputOrOutput } from '../types';
import getReceivedFunds from './getReceivedFunds';
import { functions } from '../firebase';

const findMicroAmountTransactions = (verificationReceiverAddress: string, transactions: EmbeddedTransaction[]): EmbeddedTransaction[] => {
  const microAmountTransactions: EmbeddedTransaction[] = [];
  transactions.forEach((transaction: EmbeddedTransaction) => {
    transaction.outputs.forEach((output: TransactionInputOrOutput) => {
      if ((output.addresses || []).includes(verificationReceiverAddress)) {
        microAmountTransactions.push(transaction);
      }
    })
  });
  return microAmountTransactions;
};

/**
 * Returns all funds that have been sent to the `tixlNetworkBtcAddress` from the same address which has sent a micro
 * amount (basically any BTC amount > 0) to the `receiverAddress`
 */
export default async (receiverAddress: string, tixlNetworkBtcAddress: string): Promise<ReceivedFunds[]> => {
  const getAccount = functions.httpsCallable('getAccount');
  const { data } = await getAccount({ address: receiverAddress });
  const microAmountTransactions = findMicroAmountTransactions(receiverAddress, data.txs);
  if (microAmountTransactions.length === 0) {
    return [];
  }

  let allReceivedFunds: ReceivedFunds[] = [];
  for (const transaction of microAmountTransactions) {
    if (transaction.inputs.length > 1 || transaction.inputs[0].addresses.length > 1) {
      throw new Error('Unsupported micro amount transaction');
    }

    const microAmountTransactionSenderAddress = transaction.inputs[0].addresses[0];
    const receivedFunds = await getReceivedFunds(microAmountTransactionSenderAddress, tixlNetworkBtcAddress);

    if (receivedFunds.length > 0) {
      allReceivedFunds = allReceivedFunds.concat(receivedFunds);
    }
  }

  return allReceivedFunds;
}
