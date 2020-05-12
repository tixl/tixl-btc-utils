import { Transaction, TransactionInputOrOutput } from '../types';
import { functions } from '../firebase';

class InsufficientFundsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientFundsError';
  }
}

const reduceFeesFromReceiverOutput = (outputs: TransactionInputOrOutput[], fees: number, outputAddress: string): TransactionInputOrOutput[] => {
  const clonedOutputs = [...outputs];

  const outputIndex = clonedOutputs.findIndex((output: TransactionInputOrOutput) => {
    return (output.addresses || []).includes(outputAddress);
  });

  if (outputIndex >= 0) {
    clonedOutputs[outputIndex].value = clonedOutputs[outputIndex].value - fees;
  }

  return clonedOutputs;
};

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
 * @param fromAddress The address from which the BTC should be sent
 * @param toAddress The address which should receive the BTC funds given by `value`
 * @param value The BTC funds to be sent (*IMPORTANT*: including fees)
 */
export default async (fromAddress: string, toAddress: string, value: number): Promise<Transaction> => {
  const inputs = [{ addresses: [fromAddress] }];
  const transactionData = {
    fees: undefined,
    inputs,
    outputs: [{ addresses: [toAddress], value }],
    preference: 'low',
  };

  const createTransaction = functions.httpsCallable('createTransaction');

  // we create the transaction first to determine the recommended fee
  let { data } = await createTransaction(transactionData);
  assertAllOutputsArePositive(data.tx.outputs);

  // we remove the fee from the transaction output
  transactionData.outputs = reduceFeesFromReceiverOutput(transactionData.outputs, data.tx.fees, toAddress);
  transactionData.fees = data.tx.fees;

  // create the transaction again with the adjusted fees
  data = (await createTransaction(transactionData)).data;
  const { toSign, tx } = data;
  const transaction: Transaction = {
    toSign,
    transactionData: tx,
  };

  assertAllOutputsArePositive(transaction.transactionData.outputs);
  return transaction;
};
