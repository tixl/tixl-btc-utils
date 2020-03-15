import { TransactionInputOrOutput } from '../../types';

export interface BlockcypherEmbeddedTransaction {
  hash: string;
  confirmations: number;
  inputs: TransactionInputOrOutput[];
  outputs: TransactionInputOrOutput[];
}
