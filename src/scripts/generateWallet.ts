import { generateWallet } from '../index';

const wallet = generateWallet();

console.info('Successfully created testnet wallet:');
console.info(`${wallet}`);
