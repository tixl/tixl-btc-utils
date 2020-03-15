import axios from 'axios';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { ReceivedFunds, TransactionInputOrOutput } from '../types';
import { BlockcypherEmbeddedTransaction } from './shared';

const createReceivedFundsReducer = (tixlNetworkBtcAddress: string) => {
  return (filtered: ReceivedFunds[], transaction: BlockcypherEmbeddedTransaction) => {
    let fundsValue = 0;
    transaction.outputs.forEach((output: TransactionInputOrOutput) => {
      if (output.addresses.includes(tixlNetworkBtcAddress)) {
        fundsValue += output.value;
      }
    });

    if (fundsValue > 0) {
      filtered.push({
        confirmations: transaction.confirmations,
        transactionHash: transaction.hash,
        value: fundsValue,
      });
    }

    return filtered;
  };
};

/**
 * Returns all funds that have been sent to the `tixlNetworkBtcAddress` in the same transaction in which
 * a micro amount has been sent to the `receiverAddress`
 */
export default async (receiverAddress: string, tixlNetworkBtcAddress: string): Promise<ReceivedFunds[]> => {
  try {
    const { data } = await axios.get(`${BLOCKCYPHER_BASE_URL}/addrs/${receiverAddress}/full?limit=50`);
    return (data.txs || []).reduce(createReceivedFundsReducer(tixlNetworkBtcAddress), []);
  } catch (err) {
    if (err?.response?.status === 404) {
      return [];
    } else {
      throw err;
    }
  }
}
