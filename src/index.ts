import JSBI from 'jsbi';
import { Address, Satoshi, Signature, SignedTransaction, Transaction, TransactionHash, TransactionInfos } from './types';
import { getTransaction, createTransaction as createBlockcypherTransaction, sendTransactionToNetwork as sendTransactionToBlockcypherNetwork } from './apis/blockcypher';

export const createTransaction = async (fromAddress: Address, toAddress: Address, value: Satoshi): Promise<Transaction> => {
  const { tosign, tx } = await createBlockcypherTransaction({
    inputs: [{ addresses: [fromAddress] }],
    outputs: [{ addresses: [toAddress], value: JSBI.toNumber(value) }],
  });

  return {
    transactionData: tx,
    toSign: tosign,
  };
};

export const signTransaction = (transaction: Transaction, publicKey: string, signatures: Signature[]): SignedTransaction => {
  return {
    ...transaction,
    publicKeys: [publicKey],
    signatures,
  };
};

export const sendTransactionToNetwork = async (transaction: SignedTransaction): Promise<TransactionInfos> => {
  const { publicKeys, signatures, toSign, transactionData } = transaction;
  const { confirmations, hash } = await sendTransactionToBlockcypherNetwork({
    pubkeys: publicKeys,
    signatures,
    tosign: toSign,
    tx: transactionData,
  });
  return { confirmations, hash };
};

export const getTransactionStatus = async (transactionHash: TransactionHash): Promise<TransactionInfos> => {
  const { confirmations, hash } = await getTransaction(transactionHash);
  return { confirmations, hash };
};
