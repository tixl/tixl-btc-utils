import axios from 'axios';
import { ReceivedFunds } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';

interface BlockcypherEmbeddedTransaction {
  hash: string;
  confirmations: number;
  inputs: BlockcypherEmbeddedTransactionInputOrOutput[];
  outputs: BlockcypherEmbeddedTransactionInputOrOutput[];
}

export interface BlockcypherEmbeddedTransactionInputOrOutput {
  addresses: string[];
  value: number;
}

const createReceivedFundsReducer = (fromAddress: string, toAddress: string) => {
  return (filtered: ReceivedFunds[], transaction: BlockcypherEmbeddedTransaction) => {
    let fundsValue = 0;
    let inputFound = false;
    transaction.inputs.forEach((input: BlockcypherEmbeddedTransactionInputOrOutput) => {
      if (input.addresses.includes(fromAddress)) {
        inputFound = true;
      }
    });

    if (inputFound) {
      transaction.outputs.forEach((output: BlockcypherEmbeddedTransactionInputOrOutput) => {
        if (output.addresses.includes(toAddress)) {
          fundsValue += output.value;
        }
      });
    }

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
 * Returns all BTC funds that have been transferred `fromAddress` to `toAddress`
 */
export default async (fromAddress: string, toAddress: string): Promise<ReceivedFunds[]> => {
  try {
    const { data } = await axios.get(`${BLOCKCYPHER_BASE_URL}/addrs/${toAddress}/full`);
    return (data.txs || []).reduce(createReceivedFundsReducer(fromAddress, toAddress), []);
  } catch (err) {
    if (err.response.status === 404) {
      return [];
    } else {
      throw err;
    }
  }
};
