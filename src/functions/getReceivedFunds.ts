import { EmbeddedTransaction, ReceivedFunds, TransactionInputOrOutput } from '../types';
import { functions } from '../firebase';

const createReceivedFundsReducer = (fromAddress: string, toAddress: string) => {
  return (filtered: ReceivedFunds[], transaction: EmbeddedTransaction) => {
    let fundsValue = 0;
    let inputFound = false;
    transaction.inputs.forEach((input: TransactionInputOrOutput) => {
      if (input.addresses.includes(fromAddress)) {
        inputFound = true;
      }
    });

    if (inputFound) {
      transaction.outputs.forEach((output: TransactionInputOrOutput) => {
        if ((output.addresses || []).includes(toAddress)) {
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
  const getAccount = functions.httpsCallable('getAccount');
  const { data } = await getAccount({ address: fromAddress });
  return (data.txs || []).reduce(createReceivedFundsReducer(fromAddress, toAddress), []);
};
