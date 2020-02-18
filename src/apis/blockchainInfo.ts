/**
 * In the mid-term this should not rely on the blockchain.info API only but use another (custom) implementation.
 * Anyways, for the first throw, this is absolutely fine.
 */
const blockchainInfoExplorer = require('blockchain.info/blockexplorer').usingNetwork(3);
const blockchainInfoDefaultOptions = {
  apiCode: process.env.BLOCKCHAIN_INFO_API_CODE
};

export const getLatestBlockHash = async (): Promise<string> => {
  return blockchainInfoExplorer.getLatestBlock(blockchainInfoDefaultOptions);
};

export const getBlock = async (blockHash: string): Promise<any> => {
  return blockchainInfoExplorer.getBlock(blockHash, blockchainInfoDefaultOptions);
};

export const getUnspentOutputs = async (fromAddress: string): Promise<any> => {
  return blockchainInfoExplorer.getUnspentOutputs(fromAddress, blockchainInfoDefaultOptions);
};

/**
 * Returns the hex string of a transaction
 */
export const getRawTransaction = async (txHash: string): Promise<string> => {
  return blockchainInfoExplorer.getTx(txHash, { ...blockchainInfoDefaultOptions, format: 'hex' });
};
