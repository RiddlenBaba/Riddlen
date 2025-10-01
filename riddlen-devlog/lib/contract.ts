export const DEVLOG_CONTRACT = process.env.NEXT_PUBLIC_DEVLOG_CONTRACT as `0x${string}` || '0x';

export const DEVLOG_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "content", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" },
      { "internalType": "string[]", "name": "tags", "type": "string[]" }
    ],
    "name": "createPost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalPosts",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "postId", "type": "uint256" }],
    "name": "getPost",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "address", "name": "author", "type": "address" },
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "string[]", "name": "tags", "type": "string[]" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
      ],
      "internalType": "struct RiddlenDevlog.Post",
      "name": "",
      "type": "tuple"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "offset", "type": "uint256" },
      { "internalType": "uint256", "name": "limit", "type": "uint256" }
    ],
    "name": "getRecentPosts",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "address", "name": "author", "type": "address" },
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "string[]", "name": "tags", "type": "string[]" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
      ],
      "internalType": "struct RiddlenDevlog.Post[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "category", "type": "string" }],
    "name": "getPostsByCategory",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "address", "name": "author", "type": "address" },
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "string[]", "name": "tags", "type": "string[]" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
      ],
      "internalType": "struct RiddlenDevlog.Post[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "tag", "type": "string" }],
    "name": "getPostsByTag",
    "outputs": [{
      "components": [
        { "internalType": "uint256", "name": "id", "type": "uint256" },
        { "internalType": "address", "name": "author", "type": "address" },
        { "internalType": "string", "name": "title", "type": "string" },
        { "internalType": "string", "name": "content", "type": "string" },
        { "internalType": "string", "name": "category", "type": "string" },
        { "internalType": "string[]", "name": "tags", "type": "string[]" },
        { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
        { "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
      ],
      "internalType": "struct RiddlenDevlog.Post[]",
      "name": "",
      "type": "tuple[]"
    }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "author", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "category", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "blockNumber", "type": "uint256" }
    ],
    "name": "PostCreated",
    "type": "event"
  }
] as const;

export type DevlogPost = {
  id: bigint;
  author: `0x${string}`;
  title: string;
  content: string;
  category: string;
  tags: readonly string[];
  timestamp: bigint;
  blockNumber: bigint;
};
