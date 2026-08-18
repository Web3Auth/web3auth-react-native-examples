import type { IProvider } from "@web3auth/react-native-sdk";
import { createPublicClient, createWalletClient, custom, formatEther } from "viem";

// IMP START - Blockchain Calls
/**
 * Returns the connected wallet's Ethereum address.
 * Accepts the EIP-1193 provider from `connection?.ethereumProvider`.
 */
export async function getAddress(provider: IProvider): Promise<string> {
  const walletClient = createWalletClient({ transport: custom(provider) });
  const [address] = await walletClient.getAddresses();
  return address;
}

/**
 * Returns the wallet's ETH balance as a human-readable string (e.g. "0.01 ETH").
 */
export async function getBalance(provider: IProvider): Promise<string> {
  const publicClient = createPublicClient({ transport: custom(provider) });
  const walletClient = createWalletClient({ transport: custom(provider) });
  const [address] = await walletClient.getAddresses();
  const balanceWei = await publicClient.getBalance({ address });
  return `${formatEther(balanceWei)} ETH`;
}

/**
 * Signs an arbitrary UTF-8 message and returns the hex signature.
 */
export async function signMessage(provider: IProvider, message: string): Promise<string> {
  const walletClient = createWalletClient({ transport: custom(provider) });
  const [account] = await walletClient.getAddresses();
  return walletClient.signMessage({ account, message });
}
// IMP END - Blockchain Calls
