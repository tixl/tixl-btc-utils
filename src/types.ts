type BitcoinAddress = string;

export interface Transaction {
  // currently only transactions with one sender are supported by this library (e.g. no multi-sign)
  sender: BitcoinAddress;
  transactionData: any;
  toSign: string[];
}

export interface SignedTransaction extends Transaction {
  signatures: string[];
  publicKeys: string[];
}

export interface TransactionInfos {
  confirmations: number;
  hash: string;
  // currently only transactions with one sender are supported by this library (e.g. no multi-sign)
  sender: BitcoinAddress
}

export interface ReceivedFunds {
  confirmations: number;
  transactionHash: string;
  value: number;
}

export interface TransactionInputOrOutput {
  addresses: BitcoinAddress[];
  value: number;
}

export class Wallet {
  address: BitcoinAddress;
  publicKey: string;
  privateKey: string;

  constructor(address: BitcoinAddress, publicKey: string, privateKey: string) {
    this.address = address;
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  public toString = () => {
    return `
      Address: ${this.address}
      Public Key: ${this.publicKey}
      Private Key: ${this.privateKey}
    `;
  }
}
