import { TransactionInputOrOutput } from '../../types';

export default (transactionInputs: TransactionInputOrOutput[]): string => {
  const collectedInputAddresses: Set<string> = new Set([]);
  transactionInputs.forEach((input: TransactionInputOrOutput) => {
    input.addresses.forEach((address: string) => {
      collectedInputAddresses.add(address);
    });
  });

  if (collectedInputAddresses.size > 1) {
    throw new Error('Currently only transactions with one sender are supported by this library (e.g. no multi-sign)');
  }

  if (collectedInputAddresses.size === 0) {
    throw new Error('No sender found');
  }

  const asArray: string[] = Array.from(collectedInputAddresses);
  return asArray[0];
}
