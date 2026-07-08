const { ethers } = require('ethers');

// Load contract ABI
const contractArtifact = require('../contracts/TickifyTicket.json');
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

/**
 * Get owner of an NFT ticket
 * @param {string|number} tokenId - The on-chain ticket ID
 * @returns {Promise<string>} Wallet address of the owner
 */
const getNFTOwner = async (tokenId) => {
  const rpcUrl = process.env.RPC_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    throw new Error('Blockchain configuration is missing in environment variables.');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, abi, provider);

  return await contract.ownerOf(tokenId);
};

/**
 * Call check-in function on smart contract if not yet checked in
 * @param {string|number} tokenId - The on-chain ticket ID
 * @returns {Promise<string|null>} Transaction hash or null if already checked in
 */
const checkInNFTOnChain = async (tokenId) => {
  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error('Blockchain configuration is missing in environment variables.');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // Check if already checked in to save gas/prevent revert
  const alreadyCheckedIn = await contract.isCheckedIn(tokenId);
  if (alreadyCheckedIn) {
    console.log(`Token ID ${tokenId} is already checked in on-chain.`);
    return null;
  }

  console.log(`Sending check-in transaction for Token ID: ${tokenId}`);
  const tx = await contract.checkIn(tokenId);
  console.log(`Check-in transaction sent. Hash: ${tx.hash}. Waiting for confirmation...`);
  await tx.wait();
  console.log(`Check-in transaction confirmed: ${tx.hash}`);
  return tx.hash;
};

module.exports = {
  mintTicket,
  getNFTOwner,
  checkInNFTOnChain
};
