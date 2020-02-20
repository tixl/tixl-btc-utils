import JSBI from 'jsbi';
import { createTransaction, sendTransactionToNetwork, signTransaction } from './';

const testnetAddressA = 'mtBNERDYmmnadKNCpWeyJbN1TqcuZxCh2Q';
const testnetAddressB = 'n4TzaxSJQVzVPHjQgtghaKB4g8PuRMW1yX';

const testSignature = '3044022047c1a06cff24bae7ca21d13708c6dda0b35905f3d1fca01475784508422858b5022023eb0e6bdd577fc8d0552ea31985f570198bc54d267e2e5555b7ac4a2db7cb26';

const testPublicKey = '039435962039d6960003b1841ca33c9fb7ec498f75cea5efa1c6e7be9ee3e9c1c5';

createTransaction(testnetAddressA, testnetAddressB, JSBI.BigInt(1000))
  .then(async (transaction: any) => {
    const signedTransaction = signTransaction(transaction, testPublicKey, [testSignature]);
    await sendTransactionToNetwork(signedTransaction);
  })
  .catch((err: any) => {
    console.error('Error:');
    console.error(err);
  });
//
