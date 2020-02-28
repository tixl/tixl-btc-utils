import * as BitcoreMessage from 'bitcore-message';

export default (message: string, address: string, signature: string): boolean => {
  const messageToVerify = new BitcoreMessage(message);

  return messageToVerify.verify(address, signature);
}
