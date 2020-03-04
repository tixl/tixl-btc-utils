export default (btcAddress: string) => {
  return btcAddress.startsWith('3') ||
    btcAddress.startsWith('bc1') ||
    btcAddress.startsWith('tb1');
}
