import { EmbeddedTransaction, ReceivedFunds, TransactionInputOrOutput } from '../types';
import { functions } from '../firebase';
import getReceivedFundsForTransaction from './getReceivedFundsForTransaction';

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

const hasOutputsForAddress = (tx: EmbeddedTransaction, address: string): boolean => {
  let hasOutputs = false;

  tx.outputs.forEach((output) => {
    if (output.addresses?.includes(address)) {
      hasOutputs = true;
    }
  });

  return hasOutputs;
}

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
  for (const tx of microAmountTransactions) {
    if (hasOutputsForAddress(tx, tixlNetworkBtcAddress)) {
      const receivedFunds = await getReceivedFundsForTransaction(tixlNetworkBtcAddress, tx.hash);
      if (receivedFunds) {
        allReceivedFunds.push(receivedFunds);
      }
    }
  }

  return allReceivedFunds;
}
