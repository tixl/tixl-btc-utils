export interface Transaction {
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
}

export interface ReceivedFunds {
  confirmations: number;
  transactionHash: string;
  value: number;
}

export class Wallet {
  address: string;
  publicKey: string;
  privateKey: string;

  constructor(address: string, publicKey: string, privateKey: string) {
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
