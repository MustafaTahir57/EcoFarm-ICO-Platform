import React from 'react';
import {
    useWeb3ModalAccount,
    createWeb3Modal,
    defaultConfig,
} from "@web3modal/ethers/react";

const projectId = "795245f829a8803b1c7f21e45bb2c796";

const chains = [
    {
        chainId: 56, // BSC Mainnet chain ID
        name: "Binance Smart Chain",
        currency: "BNB",
        explorerUrl: "https://bscscan.com",
        rpcUrl: "https://bsc-dataseed.binance.org", // BSC Mainnet RPC URL
    },
];

const ethersConfig = defaultConfig({
    metadata: {
        name: "Web3Modal",
        description: "Web3Modal Laboratory",
        url: "https://web3modal.com",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
    defaultChainId: 56, // Default to BSC Mainnet
    rpcUrl: "https://bsc-dataseed.binance.org", // Default RPC for BSC Mainnet
});

createWeb3Modal({
    ethersConfig,
    chains,
    projectId,
    enableAnalytics: true,
    themeMode: "dark",
    themeVariables: {
        "--w3m-accent": "rgba(255, 255, 255, 0)",
    },
});

const WalletConnection = () => {
    const { address: account, chainId } = useWeb3ModalAccount() || {};
    const isBSC = chainId === 56; // Check if the connected chain is BSC Mainnet

    return (
        <div className="d-flex justify-content-center">
            <div
                className="p-0"
                style={{ backgroundColor: "rgba(255, 255, 255, 0)", color: "black" }}
            >
                {/* Ensure w3m-button is recognized and works correctly */}
                <w3m-button />
            </div>
           
        </div>
    );
};

export default WalletConnection;
