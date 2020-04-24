import { BitcoinAddress } from '../types';
import { flattenDeep } from 'lodash';
import { functions} from '../firebase';

interface FullAddressData {
  txs: {
    inputs: {
      addresses: BitcoinAddress[];
    }[];
  }[];
}

export default async (address: BitcoinAddress): Promise<BitcoinAddress[]> => {
  const getAccount = functions.httpsCallable('getAccount');
  const { data } = await getAccount({ address });
  if (!data) {
    return [];
  }
  const inputAdresses = (data as FullAddressData).txs.map(tx =>
    tx.inputs.map(input => input.addresses)
  );
  return flattenDeep(inputAdresses);
};
