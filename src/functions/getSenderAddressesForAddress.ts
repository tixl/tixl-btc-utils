import axios from "axios";
import { BLOCKCYPHER_BASE_URL } from "../config";
import { BitcoinAddress } from "../types";
import { flattenDeep } from "lodash";

interface FullAddressData {
  txs: {
    inputs: {
      addresses: BitcoinAddress[];
    }[];
  }[];
}

export default async (address: BitcoinAddress): Promise<BitcoinAddress[]> => {
  try {
    const { data } = await axios.get(
      `${BLOCKCYPHER_BASE_URL}/addrs/${address}/full?after=1667891`
    );
    if (!data) {
      return [];
    }
    const inputAdresses = (data as FullAddressData).txs.map(tx =>
      tx.inputs.map(input => input.addresses)
    );
    console.log(data)
    return flattenDeep(inputAdresses);
  } catch (err) {
    if (err.response.status === 404) {
      return [];
    } else {
      throw err;
    }
  }
};
