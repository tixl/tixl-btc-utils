import * as bitcoin from 'bitcoinjs-lib';
import JSBI from 'jsbi';
import { createTransaction } from './';
import { prepareTransactionForSigning } from './apis/blockcypher';

const testnetAddressA = 'mv4ryaPKssB5zFZBMWAa8zcwhLCRteEfdu';
const testnetAddressB = 'n4TzaxSJQVzVPHjQgtghaKB4g8PuRMW1yX';

createTransaction(testnetAddressA, testnetAddressB, JSBI.BigInt(100))
  .then(async (res) => {
    console.info('Successfully created Bitcoin transaction');
    console.info(res);
  })
  .catch((err) => {
    console.error('Error:');
    console.error(err);
  });
