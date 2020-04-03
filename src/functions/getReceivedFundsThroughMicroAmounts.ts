import axios from 'axios';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { ReceivedFunds, TransactionInputOrOutput } from '../types';
import { BlockcypherEmbeddedTransaction, RateLimitError } from './shared';
import getReceivedFunds from './getReceivedFunds';

const findMicroAmountTransactions = (verificationReceiverAddress: string, transactions: BlockcypherEmbeddedTransaction[]): BlockcypherEmbeddedTransaction[] => {
  const microAmountTransactions: BlockcypherEmbeddedTransaction[] = [];
  transactions.forEach((transaction: BlockcypherEmbeddedTransaction) => {
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
  try {
    const { data } = await axios.get(`${BLOCKCYPHER_BASE_URL}/addrs/${receiverAddress}/full?limit=50`);
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

      // wait a little bit to avoid hitting blockcypher API limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return allReceivedFunds;
  } catch (err) {
    if (err?.response?.status === 404) {
      return [];
    } else if (err?.response?.status === 429) {
      throw new RateLimitError();
    } else {
      throw err;
    }
  }
}
