import JSBI from 'jsbi';

export interface Transaction {
  transactionData: any;
  toSign: string[];
}

export interface SignedTransaction extends Transaction {
  signatures: string[];
  publicKeys: string[];
}

export interface TransactionInfos {
  confirmations: number;
  hash: TransactionHash;
}

export type Address = string; // In Hex Format, uncompressed
export type Satoshi = JSBI; // Amount in Satoshi, use JSBI for Big Int
export type Signature = string;
export type TransactionHash = string;
