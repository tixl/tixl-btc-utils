import { ReceivedFunds } from '../types';

/**
 * Returns all funds that have been sent to `toAddress` in the transaction identified by the `transactionHash`
 */
export default async (toAddress: string, transactionHash: string): Promise<ReceivedFunds|null> => {
  try {
    
  } catch (err) {
    if (err.response.status === 404) {
      return null;
    } else {
      throw err;
    }
  }
}
