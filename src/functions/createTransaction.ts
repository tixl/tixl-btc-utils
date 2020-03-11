import axios from 'axios';
import { Transaction, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { getTransactionSender } from './shared';

const reduceFeesFromReceiverOutput = (transaction: Transaction, fees: number, outputAddress: string): Transaction => {
  const clonedTransaction = {
    ...transaction,
  };

  const outputIndex = clonedTransaction.transactionData.outputs.findIndex((output: TransactionInputOrOutput) => {
    return output.addresses.includes(outputAddress);
  });

  if (outputIndex >= 0) {
    (clonedTransaction.transactionData.outputs[outputIndex] as TransactionInputOrOutput).value = (clonedTransaction.transactionData.outputs[outputIndex] as TransactionInputOrOutput).value - fees;
  }

  return clonedTransaction;
};

export const assertAllOutputsArePositive = (transaction: Transaction) => {
  transaction.transactionData.outputs.forEach((output: TransactionInputOrOutput) => {
    if (output.value <= 0) {
      throw new Error(`Found output with value ${output.value}, can not send this transaction. Transaction as JSON: ${JSON.stringify(transaction)}`);
    }
  });
};

export default async (fromAddress: string, toAddress: string, value: number): Promise<Transaction> => {
  const inputs = [{ addresses: [fromAddress] }];
  const transactionData = {
    inputs,
    outputs: [{ addresses: [toAddress], value }],
    preference: 'medium',
  };

  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);
  try {
    const { data: { tosign, tx } } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/new`, JSON.stringify(transactionData));

    const transaction = reduceFeesFromReceiverOutput({
      sender,
      transactionData: tx,
      toSign: tosign,
    }, tx.fees, toAddress);

    assertAllOutputsArePositive(transaction);
    return transaction;
  } catch (err) {
    if (err.response?.status === 400) {
      throw new Error(`Bad request from API, errors are here: ${JSON.stringify(err.response.data)}`)
    }
    throw err;
  }
};
