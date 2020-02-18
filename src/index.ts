import * as bitcoin from 'bitcoinjs-lib';
import JSBI from 'jsbi';
import { getBlock, getLatestBlockHash, getRawTransaction, getUnspentOutputs } from './apis/blockcypher';
import { Transaction } from './types';

const coinselect = require('coinselect');

type Address = string; // In Hex Format, uncompressed
type Satoshi = JSBI; // Amount in Satoshi, use JSBI for Big Int

const isSegwitTx = (rawTx: string): boolean => {
  return rawTx.substring(8, 12) === '0001';
};

/**
 * Returns the fee rate in satoshi/byte
 */
const getFeeRate = async (): Promise<number> => {
  const latestBlockHash = await getLatestBlockHash();
  const latestBlock = await getBlock(latestBlockHash);
  return Math.ceil(latestBlock.fees / latestBlock.size);
};

export const createTransaction = async (fromAddress: Address, to: Address, amount: Satoshi): Promise<Transaction> => {
  const feeRate = await getFeeRate();
  const targets = [
    {
      address: to,
      value: JSBI.toNumber(amount),
    }
  ];

  const unspentOutputs = await getUnspentOutputs(fromAddress);
  const { inputs, outputs, fee } = coinselect(
    unspentOutputs.map((output: any, index: any) => {
      return {
        script: output.script,
        txId: output.tx_hash,
        vout: index,
        value: output.value,
      };
    }),
    targets,
    feeRate,
  );

  const transaction = new bitcoin.Psbt({ network: bitcoin.networks.testnet });
  for (let index = 0; index < inputs.length; index++) {
    const input = inputs[index];
    const rawTransaction = await getRawTransaction(input.txId);
    const inputData: any = {
      hash: input.txId,
      index,
    };

    if (isSegwitTx(rawTransaction)) {
      inputData.nonWitnessUtxo = Buffer.from(rawTransaction, 'hex');
      inputData.scriptPubKey = Buffer.from(input.script, 'hex');
    } else {
      inputData.nonWitnessUtxo = Buffer.from(rawTransaction, 'hex');
    }

    transaction.addInput(inputData);
  }

  outputs.forEach(({ address, value }: any) => {
    transaction.addOutput({
      address: address || fromAddress,
      value,
    });
  });

  const toSign: string[] = [];
  transaction.data.inputs.forEach((input: any, index: number) => {
    // @ts-ignore
    const { hash } = bitcoin.Psbt.getHashForSig(index, input, transaction.__CACHE);
    toSign.push(hash.toString('hex'));
  });

  return {
    toSign,
  };
};
