// @ts-ignore
import walletAddressValidator from 'wallet-address-validator';

export default (btcAddress: string) => {
  return walletAddressValidator.validate(btcAddress, 'bitcoin', 'both');
}
