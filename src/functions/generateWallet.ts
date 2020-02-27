import { Wallet } from '../types';
import * as bitcoin from 'bitcoinjs-lib';

export default (): Wallet => {
  const keyPair = bitcoin.ECPair.makeRandom({ network: bitcoin.networks.testnet });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: bitcoin.networks.testnet,
  });

  return new Wallet(address!, keyPair.publicKey.toString('hex'), keyPair.privateKey!.toString('hex'));
};
