import axios from 'axios';
import { Transaction, TransactionInputOrOutput } from '../types';
import { BLOCKCYPHER_BASE_URL } from '../config';
import { getTransactionSender } from './shared';

const reduceFeesFromReceiverOutput = (outputs: TransactionInputOrOutput[], fees: number, outputAddress: string): TransactionInputOrOutput[] => {
  const clonedOutputs = [...outputs];

  const outputIndex = clonedOutputs.findIndex((output: TransactionInputOrOutput) => {
    return output.addresses.includes(outputAddress);
  });

  if (outputIndex >= 0) {
    clonedOutputs[outputIndex].value = clonedOutputs[outputIndex].value - fees;
  }

  return clonedOutputs;
};

export const assertAllOutputsArePositive = (transaction: Transaction) => {
  transaction.transactionData.outputs.forEach((output: TransactionInputOrOutput) => {
    if (output.value <= 0) {
      throw new Error(`Found output with value ${output.value}, can not send this transaction. Transaction as JSON: ${JSON.stringify(transaction)}`);
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
    preference: 'medium',
  };
  const sender = getTransactionSender(inputs as TransactionInputOrOutput[]);

  console.log('Doing first request');
  // we create the transaction first to determine the recommended fee
  const { data: { tx: { fees } } } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/new`, JSON.stringify(transactionData));

  // we remove the fee from the transaction output
  transactionData.outputs = reduceFeesFromReceiverOutput(transactionData.outputs, fees, toAddress);
  transactionData.fees = fees;

  try {
    // create the transaction again with the adjusted fees
    const { data: { tosign, tx } } = await axios.post(`${BLOCKCYPHER_BASE_URL}/txs/new`, JSON.stringify(transactionData));
    const transaction: Transaction = {
      sender,
      toSign: tosign,
      transactionData: tx,
    };

    assertAllOutputsArePositive(transaction);
    return transaction;
  } catch (err) {
    if (err.response?.status === 400) {
      throw new Error(`Bad request from API, errors are here: ${JSON.stringify(err.response.data)}`)
    }
    throw err;
  }
};
