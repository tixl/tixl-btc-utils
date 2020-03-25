import axios from 'axios';
import { ReceivedFunds, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { RateLimitError } from './shared';

/**
 * Returns all funds that have been sent to `toAddress` in the transaction identified by the `transactionHash`
 */
export default async (toAddress: string, transactionHash: string): Promise<ReceivedFunds|null> => {
  try {
    const { data } = await axios.get(`${BLOCKCYPHER_BASE_URL}/txs/${transactionHash}`);
    let fundsValue = 0;
    data.outputs.forEach((output: TransactionInputOrOutput) => {
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
    } else if (err?.response?.status === 429) {
      throw new RateLimitError();
    } else {
      throw err;
    }
  }
}
