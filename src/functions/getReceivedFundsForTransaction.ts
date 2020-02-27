import axios from 'axios';
import { ReceivedFunds } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { BlockcypherEmbeddedTransactionInputOrOutput } from './getReceivedFunds';

/**
 * Returns all funds that have been sent to `toAddress` in the transaction identified by the `transactionHash`
 */
export default async (toAddress: string, transactionHash: string): Promise<ReceivedFunds|null> => {
  try {
    const { data } = await axios.get(`${BLOCKCYPHER_BASE_URL}/txs/${transactionHash}`);
    let fundsValue = 0;
    data.outputs.forEach((output: BlockcypherEmbeddedTransactionInputOrOutput) => {
      if (output.addresses.includes(toAddress)) {
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
  } catch (err) {
    if (err.response.status === 404) {
      return null;
    } else {
      throw err;
    }
  }
}
