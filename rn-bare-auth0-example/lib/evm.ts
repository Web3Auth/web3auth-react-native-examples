import { ethers } from "ethers";

// IMP START - Blockchain Calls
/**
 * Returns the connected wallet's Ethereum address.
 * Accepts the `provider` value from `useWeb3Auth()`.
 */
export async function getAddress(provider: ethers.Eip1193Provider): Promise<string> {
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  return signer.getAddress();
}

/**
 * Returns the wallet's ETH balance as a human-readable string (e.g. "0.01 ETH").
 */
export async function getBalance(provider: ethers.Eip1193Provider): Promise<string> {
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  const balanceWei = await ethersProvider.getBalance(await signer.getAddress());
  return `${ethers.formatEther(balanceWei)} ETH`;
}

/**
 * Signs an arbitrary UTF-8 message and returns the hex signature.
 */
export async function signMessage(provider: ethers.Eip1193Provider, message: string): Promise<string> {
  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  return signer.signMessage(message);
}
// IMP END - Blockchain Calls
