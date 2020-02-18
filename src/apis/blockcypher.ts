import axios from 'axios';
const blockcypherBaseUri = 'https://api.blockcypher.com/v1/btc/test3';

export const getLatestBlockHash = async (): Promise<string> => {
  const { data: { hash } } = await axios.get(blockcypherBaseUri);
  return hash;
};

export const getBlock = async (blockHash: string): Promise<any> => {
  const { data } = await axios.get(`${blockcypherBaseUri}/blocks/${blockHash}`);
  return data;
};

export const getUnspentOutputs = async (fromAddress: string): Promise<any> => {
  const { data: { txrefs } } = await axios.get(`${blockcypherBaseUri}/addrs/${fromAddress}?unspentOnly=true&includeScript=true`);
  return txrefs;
};

/**
 * Returns the hex string of a transaction
 */
export const getRawTransaction = async (txHash: string): Promise<string> => {
  const { data: { hex }} = await axios.get(`${blockcypherBaseUri}/txs/${txHash}?includeHex=true`);
  return hex;
};

export const prepareTransactionForSigning = async (txData: any): Promise<void> => {
  const res = await axios.post(`${blockcypherBaseUri}/txs/new`, JSON.stringify(txData));
  console.log(res);
};
