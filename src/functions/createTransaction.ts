import { Transaction, TransactionInputOrOutput } from '../types';
import { functions } from '../firebase';

class InsufficientFundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientFundsError';
  }
}

export const assertAllOutputsArePositive = (outputs: TransactionInputOrOutput[]) => {
  (outputs || []).forEach((output: TransactionInputOrOutput) => {
    if (output.value <= 0) {
      throw new InsufficientFundsError(`Found output with value ${output.value}, can not send this transaction. Outputs as JSON: ${JSON.stringify(outputs)}`);
    }
  });
};

/**
 * @todo - We could extend this function so that it accepts another boolean param `includingFees` which specifies
 * if the fee should be included in the value or on top
 *
 * @param fromAdr The address from which the BTC should be sent
 * @param toAdr   The address which should receive the BTC funds given by `value`
 * @param value   The BTC funds to be sent (*IMPORTANT*: including fees)
 */
export default async (fromAdr: string, toAdr: string, value: number): Promise<Transaction> => {
  const createTransaction = functions.httpsCallable('createTransaction');

  const data = (await createTransaction({
    fromAdr,
    toAdr,
    value,
  })).data;

  assertAllOutputsArePositive(data.tx.outputs);

  const { toSign, tx } = data;
  return {
    toSign,
    transactionData: tx,
  };
};
