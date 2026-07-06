const { ethers } = require('ethers');
const path = require('path');

// Load contract ABI from Hardhat artifact
const contractArtifactPath = path.join(__dirname, '../../blockchain/artifacts/contracts/TickifyTicket.sol/TickifyTicket.json');
const contractArtifact = require(contractArtifactPath);
const abi = contractArtifact.abi;

/**
 * Mint an NFT ticket on Sepolia blockchain
 * @param {string} walletAddress - The participant's wallet address to mint the NFT to
 * @param {Object} ticketData - Object containing eventId or event_id
 * @returns {Promise<{txHash: string, tokenId: string}>}
 */
const mintTicket = async (walletAddress, ticketData) => {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error('Blockchain configuration is missing in environment variables.');
  }

  // 1. Initialize JsonRpcProvider
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // 2. Initialize Wallet with private key
  const wallet = new ethers.Wallet(privateKey, provider);

  // 3. Initialize Contract
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Get eventId from ticketData
  const eventId = ticketData.eventId || ticketData.event_id;
  if (!eventId) {
    throw new Error('eventId is required for minting ticket.');
  }

  console.log(`Sending mint transaction for wallet: ${walletAddress}, eventId: ${eventId}`);

  // 4. Send transaction
  const tx = await contract.mintTicket(walletAddress, eventId);
  console.log(`Transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);

  // 5. Wait for transaction to be mined
  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

  // 6. Find Transfer event log and parse tokenId
  let tokenId = null;
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === 'Transfer') {
        // Transfer event signature: Transfer(address from, address to, uint256 tokenId)
        tokenId = parsedLog.args.tokenId.toString();
        console.log(`Minted Token ID: ${tokenId} extracted from logs`);
        break;
      }
    } catch (err) {
      // Log parsing might fail for logs emitted by other contracts (if any) or if index mismatch, ignore
    }
  }

  if (!tokenId) {
    throw new Error('Failed to retrieve tokenId from transaction receipt logs.');
  }

  return {
    txHash: tx.hash,
    tokenId: tokenId
  };
};

module.exports = {
  mintTicket
};
