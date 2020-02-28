// @ts-ignore
import bitcoreMessage from 'bitcore-message';

export default (message: string, address: string, signature: string): boolean => {
  const messageToVerify = bitcoreMessage(message);

  return messageToVerify.verify(address, signature);
}
