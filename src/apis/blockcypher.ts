import axios from 'axios';
const blockcypherBaseUri = 'https://api.blockcypher.com/v1/btc/test3';

interface BlockcypherTransactionInfos {
  confirmations: number;
  hash: string;
}

interface BlockcypherTransaction {
  pubkeys?: string[];
  signatures?: string[];
  tx: any;
  tosign: string[];
}

export const getTransaction = async (transactionHash: string): Promise<BlockcypherTransactionInfos> => {
  const { data } = await axios.get(`${blockcypherBaseUri}/txs/${transactionHash}`);
  return data;
};

export const createTransaction = async (transactionData: any): Promise<BlockcypherTransaction> => {
  const { data } = await axios.post(`${blockcypherBaseUri}/txs/new`, JSON.stringify(transactionData));
  return data;
};

export const sendTransactionToNetwork = async (transaction: BlockcypherTransaction): Promise<BlockcypherTransactionInfos> => {
  const { data } = await axios.post(`${blockcypherBaseUri}/txs/send`, JSON.stringify(transaction));
  return data.tx;
};
