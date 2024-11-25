import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ecoAbi, ecoAddress } from "./contract/Eco1";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

function Apple({ onTokenAmountsUpdate, onEtherAmountChange,selectedCoin, setSelectedCoin   }) {

    const [errorMessage, setErrorMessage] = useState("");


    const { address: account, chainId } = useWeb3ModalAccount();
    const isBSC = chainId === 56;
    
     
    
  

        const [etherAmount, setEtherAmount] = useState('');
        const [tokenAmountETH, setTokenAmountETH] = useState(null);
        const [tokenAmountUSDT, setTokenAmountUSDT] = useState(null);
        const [tokenAmountWBTC, setTokenAmountWBTC] = useState(null);
      
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(ecoAbi, ecoAddress);
      
        const handleInputChange = (event) => {
            const amount = event.target.value;
            setEtherAmount(amount);
            onEtherAmountChange(amount); // Send the updated etherAmount to App.jsx
          };
      
        const fetchTokenAmounts = async () => {
          try {
            const weiAmount = web3.utils.toWei(etherAmount || '0', 'ether');
            const [amountETH, amountUSDT, amountWBTC] = await Promise.all([
              contract.methods.getTokenAmountETH(weiAmount).call(),
              contract.methods.getTokenAmountUSDT(weiAmount).call(),
              contract.methods.getTokenAmountUSDC(weiAmount).call(),
            ]);
      
            setTokenAmountETH(Number(amountETH));
            setTokenAmountUSDT(Number(amountUSDT));
            setTokenAmountWBTC(Number(amountWBTC));
      
            // Pass the new token amounts to the parent component (App.jsx)
            onTokenAmountsUpdate(amountETH, amountUSDT, amountWBTC);
      
          } catch (error) {
            console.error('Error fetching token amounts:', error);
          }
        };
        // console.log ("onTokenAmountsUpdate",tokenAmountETH, tokenAmountUSDT, tokenAmountWBTC)
        useEffect(() => {
          if (etherAmount) {
            fetchTokenAmounts();
          }
        }, [etherAmount]);
      
        return (
          <>
           
            <input
              type="number"
              value={etherAmount}
              onChange={handleInputChange}
              placeholder={`Enter ${selectedCoin}`}
              
            />

          </>
        );
      }
      
      export default Apple;