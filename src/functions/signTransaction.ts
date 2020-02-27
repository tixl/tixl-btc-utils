import { SignedTransaction, Transaction } from '../types';

export default (transaction: Transaction, publicKey: string, signatures: string[]): SignedTransaction => {
  return {
    ...transaction,
    publicKeys: [publicKey],
    signatures,
  };
};
