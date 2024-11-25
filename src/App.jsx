import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { ecoAbi, ecoAddress } from "./contract/Eco1";
import { btcAbi, btcAddress } from "./contract/Btc";
import { bnbAbi, bnbAddress } from "./contract/Bnb";
import { usdtAbi, usdtAddress } from "./contract/Usdt";
import { toNumber } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Apple from "./Apple";
import WalletConnection from "./WalletConnection";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
function App() {
  const [errorMessage, setErrorMessage] = useState("");
  const [price, setPrice] = useState(null);
  const [duration, setDuration] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [listPrice, setListPrice] = useState("");
  const [unixTime, setUnixTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [amount, setAmount] = useState();
  const [processedAmount, setProcessedAmount] = useState(0);
  const [rounded, setRoundedPrice] = useState();
  const [loading, setLoading] = useState(false); // Loading state
  // const [unixTimes, setUnixTimes] = useState(0);
  // const [timestamp, setTimestamp] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("usdt");
  const [owner, setOwner] = useState("");
  const [link, setLink] = useState("");
  const [etherAmount, setEtherAmount] = useState(""); // State to hold etherAmount in App.jsx
  const { address: account, chainId } = useWeb3ModalAccount();
  const isBSC = chainId === 56;
  // Callback to update etherAmount when it changes in Apple
  const handleEtherAmountChange = (amount) => {
    setEtherAmount(amount);
  };
  const [tokenAmounts, setTokenAmounts] = useState({
    eth: null,
    usdt: null,
    wbtc: null,
  });

  const handleTokenAmountsUpdate = (eth, usdt, wbtc) => {
    setTokenAmounts({
      eth,
      usdt,
      wbtc,
    });
  };
  const [selectedTokenAmount, setSelectedTokenAmount] = useState(0);

  // console.log("selectedTokenAmount",selectedTokenAmount)
  // Update selectedTokenAmount whenever selectedCoin or tokenAmounts changes
  useEffect(() => {
    let amount;
    switch (selectedCoin) {
      case "usdt":
        amount = tokenAmounts.usdt;
        break;
      case "bnb":
        amount = tokenAmounts.eth;
        break;
      case "bitcoin":
        amount = tokenAmounts.wbtc;
        break;
      default:
        amount = 0;
    }
    setSelectedTokenAmount(Number(amount));
  }, [selectedCoin, tokenAmounts]);
  // console.log("tokenAmounts",tokenAmounts);

  // const handleAmountChange = (e) => {
  //   const inputValue = e.target.value;
  //   setAmount(inputValue); // Set the raw input value

  //   // Process the amount only if it's a valid number
  //   if (inputValue) {
  //     const calculatedAmount = (inputValue * 1e18 * 100000000) / rounded;
  //     const getting = calculatedAmount / 1e18;
  //     // console.log("calculatedAmount",calculatedAmount/1e18,rounded);

  //     setProcessedAmount(getting);
  //   } else {
  //     setProcessedAmount(0); // Reset if input is empty
  //   }
  // };

  useEffect(() => {
    // Automatically fetch rounded price details when account or network status changes
    const fetchRoundedPriceDetails = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);

        const response = await financeAppTokenOf.methods
          .currentRound()
          .call({ from: account });

        const price = response.priceUSD;
        const duration = response.duration;
        const startTime = response.startTime;

        const adjustedPrice = parseFloat(price) / Math.pow(10, 18);
        const finalPrice = adjustedPrice;

        setPrice(finalPrice);
        setDuration(duration);
        setStartTime(startTime);

        const uni = parseInt(duration, 10) + parseInt(startTime, 10);
        setUnixTime(uni);
        console.log("Placing time (Unix):", uni);
        console.log("Start time:", startTime);
        const roundPrice = await financeAppTokenOf.methods
          .roundPriceUSD()
          .call({ from: account });
        const data = parseFloat(roundPrice) / Math.pow(10, 18);
        setRoundedPrice(data);
        console.log("Response from currentRound:", account);

        // console.log("Price type:", typeof price, "Value:", price);
        // console.log("Duration type:", typeof duration, "Value:", duration);
        // console.log("StartTime type:", typeof startTime, "Value:", startTime);
        // console.log("StartTime typeeeeeeee:", rounded);

        // console.log("StartTime adjustedPrice:", adjustedPrice);
        // if (isNaN(adjustedPrice)) {
        //   throw new Error("Invalid price value");
        // }
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };

    console.log("Fetching rounded price details:", price, duration, startTime);

    if (account && isBSC) {
      fetchRoundedPriceDetails();
    }
  }, [account, isBSC]);

  useEffect(() => {
    const listingPrice = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);

        const responses = await financeAppTokenOf.methods
          .listingPriceUSD()
          .call({ from: account });

        let pricelist = parseFloat(responses) / Math.pow(10, 18);

        if (pricelist === 0) {
          setListPrice("Null"); // Set to null if value is 0
        } else {
          pricelist = parseFloat(pricelist.toFixed(2)); // Round to 2 decimal places
          setListPrice(pricelist);
        }
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };

    if (account && isBSC) {
      listingPrice();
    }
  }, [account, isBSC]);

  const [targetAmounts, setTargetAmount] = useState(null);
  const [risingData, setRisingData] = useState();
  const [investment, setInvestment] = useState();
  const [rewads, setRwads] = useState();
  const [balance, setBalance] = useState();
  const [potentional, setPotentional] = useState(0);

  useEffect(() => {
    const targetAmountUSD = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);

        const responses = await financeAppTokenOf.methods
          .targetAmountUSD()
          .call();
        const rising = await financeAppTokenOf.methods.totalRaised().call();

        const amountAsNumber = parseFloat(responses) / Math.pow(10, 18);
        const amountRising = Number(rising) / Math.pow(10, 18);
        const amountRisingPercentage = (amountRising / amountAsNumber) * 100; // Calculate the percentage
        setRisingData(amountRisingPercentage.toFixed(2));
        console.log(" risingData rounded price details:", amountRising);

        setTargetAmount(amountAsNumber);
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };
    // console.log(" fetching rounded price details:", listPrice);
    console.log("percentageValue", investment);
    if (account && isBSC) {
      targetAmountUSD();
    }
  }, [account, isBSC]);

  const [round, SetRound] = useState(null);
  useEffect(() => {
    const roundedNo = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);

        const rounds = await financeAppTokenOf.methods
          .roundNumber()
          .call({ from: account });
        const roundedfinal = Number(rounds);
        SetRound(roundedfinal);
        console.log("Contract Responsessssss:", round);
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };
    // console.log(" fetching rounded price details:", listPrice);

    if (account && isBSC) {
      roundedNo();
    }
  }, [account, isBSC]);

  useEffect(() => {
    let interval;

    const roundedNo = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);

        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);
        const getUserData = await financeAppTokenOf.methods
          .getUserData(account)
          .call();

        const investment = Number(getUserData.investment) / 1e18;
        const balance = Number(getUserData.balance) / 1e18; // Convert from Wei to Ether
        const rewad = Number(getUserData.referralReward) / 1e18; // Convert from Wei to Ether
        // console.log("balance", balance);
        // console.log("investment", investment);

        setBalance(balance.toFixed()); // Restrict to 4 decimal places
        setRwads(rewad.toFixed());
        setInvestment(investment);
        const potentional = listPrice * balance;
        setPotentional(potentional);
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };

    if (account && isBSC) {
      roundedNo(); // Call immediately
      interval = setInterval(roundedNo, 1000); // Repeat every 1 second
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup on unmount
    };
  }, [account, isBSC]);

  const formatAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getLangFromCookies = () => {
    const match = document.cookie.match(/lang=([^;]+)/);
    return match ? match[1] : "En";
  };

  const [currentLang, setCurrentLang] = useState(getLangFromCookies());

  const changeLang = (lang) => {
    const d = new Date();
    d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // Set cookie expiration to 30 days
    const expires = "expires=" + d.toUTCString();

    // Set the language cookie
    document.cookie = `lang=${lang};${expires};path=/`;

    // If the selected language is English, remove any translation cookies
    if (lang === "En") {
      console.log("Removing translation");
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;

      // Optionally, remove any other translation related scripts or elements
      const googleTranslateElement = document.getElementById(
        "google_translate_element"
      );
      if (googleTranslateElement) {
        googleTranslateElement.remove(); // Remove the Google Translate element if exists
      }
    } else {
      // Set the googtrans cookie for other languages
      document.cookie = `googtrans=/en/${lang.toLowerCase()};${expires};path=/`;
    }

    // Update state and reload the page
    setCurrentLang(lang);
    window.location.reload(true);
  };

  useEffect(() => {
    if (currentLang === "En") return; // Skip translation for English

    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout:
            window.google.translate.TranslateElement.FloatPosition.TOP_LEFT,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, [currentLang]); // Add currentLang as a dependency

  const [activeLink, setActiveLink] = useState("home");

  const handleLinkClick = (link) => {
    setActiveLink(link); // Track the clicked link
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 70; // Adjust based on navbar height
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveLink(sectionId); // Update the active link based on scroll position
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const calculateTimeLeft = () => {
    const targetDate = new Date("2024-10-18T23:59:59");
    const currentTime = new Date();
    const difference = targetDate - currentTime;

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Progress bars animation logic for multiple bars
  useEffect(() => {
    const progressBars = document.querySelectorAll(".progress-bar");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const progressBar = entry.target;
            progressBar.style.width = `${progressBar.getAttribute(
              "data-width"
            )}%`;
          }
        });
      },
      {
        threshold: 1,
      }
    );

    progressBars.forEach((progressBar) => {
      observer.observe(progressBar);
    });

    return () => {
      progressBars.forEach((progressBar) => {
        observer.unobserve(progressBar);
      });
    };
  }, []);

  // Fade-in logic for elements with the .fade class
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    fadeElements.forEach((fadeElement) => {
      observer.observe(fadeElement);
    });

    return () => {
      fadeElements.forEach((fadeElement) => {
        observer.unobserve(fadeElement);
      });
    };
  }, []);

  useEffect(() => {
    if (unixTime) {
      // Calculate the remaining time every second
      const intervalId = setInterval(() => {
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeLefts = unixTime - currentTime; // Calculate remaining time
        setRemainingTime(timeLefts > 0 ? timeLefts : 0); // Ensure it doesn't go negative
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [unixTime]);

  // Convert remaining time to days, hours, minutes, and seconds
  const formatTime = (time) => {
    const days = Math.floor(time / 86400); // 86400 seconds in a day
    const hours = Math.floor((time % 86400) / 3600); // Remaining hours
    const minutes = Math.floor((time % 3600) / 60); // Remaining minutes
    const seconds = time % 60; // Remaining seconds
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatTime(remainingTime);
  // console.log("days, hours, minutes, seconds ", days, hours, minutes, seconds);
  useEffect(() => {
    // Automatically fetch rounded price details when account or network status changes
    const fetchRoundedPriceDetails = async () => {
      if (!account || !isBSC) {
        setErrorMessage("Please connect to Binance Smart Chain Testnet.");
        return;
      }

      try {
        const web3 = new Web3(window.ethereum);
        const financeAppTokenOf = new web3.eth.Contract(ecoAbi, ecoAddress);

        const owner = await financeAppTokenOf.methods
          .owner()
          .call({ from: account });
        setOwner(owner);

        console.log("Response from owner:", owner);
      } catch (error) {
        console.error("Error fetching rounded price details:", error);
        setErrorMessage(
          "Error fetching rounded price details. Please try again."
        );
      }
    };

    console.log("Fetching rounded price details:", price, duration, startTime);

    if (account && isBSC) {
      fetchRoundedPriceDetails();
    }
  }, [account, isBSC]);

  const [referralAddress, setReferralAddress] = useState("");
  const defaultReferralAddress = owner;
  // console.log("referralAddress",referralAddress) // Replace with actual default referral address
  const addresses = {
    usdt: usdtAddress, // Replace with actual USDT address
    bnb: bnbAddress, // Replace with actual BNB address
    bitcoin: btcAddress, // Replace with actual BTC address
  };

  // const ecoAddress = "0x36Eb7A41c1CB84b2b4276b02442e76A56c7609a8"; // Replace with actual contract address

  // Check for referral address in URL or use default
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refAddress = urlParams.get("ref");
    setReferralAddress(refAddress || defaultReferralAddress);
  });
  // console.log("referralAddress",referralAddress);

  // Connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } else {
      alert("Please install a web3 wallet.");
    }
  };

  // Generate Referral Link
  const generateReferralLink = () => {
    if (investment > 0) {
      setLink(`${window.location.origin}?ref=${account}`);
      return link;
    } else {
      toast.warning(
        "You need to complete a purchase before generating a referral link."
      );
      return null;
    }
  };
  const handleChanges = (event) => {
    setSelectedCoin(event.target.value);
  };

  // Approve token function
  const approve = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet.");
      return false;
    }

    if (!etherAmount || isNaN(etherAmount) || Number(etherAmount) <= 0) {
      setErrorMessage("Please enter a valid amount.");
      return false;
    }

    try {
      const web3 = new Web3(window.ethereum);
      let tokenAddress, tokenAbi;

      switch (selectedCoin) {
        case "usdt":
          tokenAddress = addresses.usdt;
          tokenAbi = usdtAbi;
          break;
        case "bnb":
          tokenAddress = addresses.bnb;
          tokenAbi = bnbAbi;
          break;
        case "bitcoin":
          tokenAddress = addresses.bitcoin;
          tokenAbi = btcAbi;
          break;
        default:
          throw new Error("Unsupported coin selected");
      }

      const approveToken = new web3.eth.Contract(tokenAbi, tokenAddress);
      const amountInWei = web3.utils.toWei(etherAmount, "ether");

      const tx = await approveToken.methods
        .approve(ecoAddress, amountInWei)
        .send({ from: account });

      setTransactionStatus(`Approval successful! Hash: ${tx.transactionHash}`);
      setErrorMessage("");
      return true;
    } catch (error) {
      console.error("Error during approval:", error);
      setErrorMessage("Error during approval. Please try again.");
      setTransactionStatus("");
      return false;
    }
  };

  // Buy token function
  const buyToken = async () => {
    if (!account) {
      setErrorMessage("Please connect your wallet.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(ecoAbi, ecoAddress); // Ensure `ecoAbi` is defined
      const waiAmount = web3.utils.toWei(etherAmount, "ether");
      console.log("Attempting to buy tokens with the following parameters:");
      console.log("Amount in Wei:", waiAmount);
      console.log("Selected Coin Address:", addresses[selectedCoin]);
      console.log("Referral Address:", referralAddress);

      let tx;
      if (selectedCoin === "bnb") {
        // Pass the value in the transaction for BNB
        tx = await contract.methods
          .buyTokens(waiAmount, addresses[selectedCoin], referralAddress)
          .send({ from: account, value: waiAmount });
      } else {
        // For USDT and BTC, do not include the value parameter
        tx = await contract.methods
          .buyTokens(waiAmount, addresses[selectedCoin], referralAddress)
          .send({ from: account });
      }

      setTransactionStatus(`Purchase successful! Hash: ${tx.transactionHash}`);
      setHasPurchased(true); // Set flag to indicate successful purchase
    } catch (error) {
      console.error("Error during token purchase:", error);

      if (error.code === 4001) {
        setErrorMessage("Transaction rejected by the user.");
      } else {
        setErrorMessage("Purchase failed. Please try again.");
      }
      setTransactionStatus("");
    }
  };

  // Handle buy click event
  const handleBuyClick = async () => {
    setLoading(true);
    setErrorMessage("");
    setTransactionStatus("");

    if (selectedCoin === "bnb") {
      // For BNB, call buyToken directly without approval
      await buyToken();
    } else {
      // For USDT and BTC, first approve then proceed to buy
      const approvalSuccess = await approve();
      if (!approvalSuccess) {
        setLoading(false);
        return;
      }
      await buyToken();
    }

    setLoading(false);
  };

  return (
    <>
      <ToastContainer />
      <nav
        className="navbar fixed-top navbar-expand-lg pt-5 pb-4"
        id="nav"
        data-bs-spy="scroll"
        data-bs-target="#nav"
        data-bs-offset="70"
        tabIndex="0"
      >
        <div className="container">
          <a className="navbar-brand position-relative" href="#">
            <img
              src="/images/headerlighting.png"
              alt="logo"
              loading="eager"
              className="object-fit-contain position-absolute header-lighting"
            />
            <img
              src="/images/logo.png"
              alt="logo"
              loading="eager"
              className="object-fit-contain position-relative"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav nav-underline mx-auto mt-3 mt-lg-0 mb-5 mb-lg-0 fw-lighter align-items-center">
              {["home", "ICO", "roadmap", "tokenomics", "team", "faq"].map(
                (link) => (
                  <li className="nav-item" key={link}>
                    <a
                      className={`nav-link ${
                        activeLink === link ? "active fw-lighter" : "fw-lighter"
                      }`}
                      href={`#${link}`}
                      onClick={() => handleLinkClick(link)} // Set the active link on click
                    >
                      {link.charAt(0).toUpperCase() + link.slice(1)}
                    </a>
                  </li>
                )
              )}
            </ul>
            <div className="d-flex flex-column flex-lg-row align-items-center gap-4 justify-content-center ">
              <div className="dropdown">
                <a
                  className="nav-link dropdown-toggle btn btn-dark"
                  href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                  target="_blank"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  translate="no" // Prevent translation
                >
                  <img
                    src="/images/www.svg"
                    alt="www"
                    loading="eager"
                    className="object-fit-contain"
                  />
                  {currentLang} {/* Show the current selected language */}
                </a>
                <ul className="dropdown-menu overflow-hidden">
                  {/* Language options */}
                  {currentLang !== "Pl" && (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#googtrans(en|pl)"
                        onClick={() => changeLang("Pl")}
                      >
                        Polish
                      </a>
                    </li>
                  )}
                  {currentLang !== "De" && (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#googtrans(en|de)"
                        onClick={() => changeLang("De")}
                      >
                        German
                      </a>
                    </li>
                  )}
                  {currentLang !== "Uk" && (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#googtrans(en|uk)"
                        onClick={() => changeLang("Uk")}
                      >
                        Ukrainian
                      </a>
                    </li>
                  )}
                  {currentLang !== "En" && (
                    <li>
                      <a
                        className="dropdown-item"
                        href="#googtrans(pl|en)"
                        onClick={() => changeLang("En")}
                      >
                        English
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="btn btn-success">
                <img
                  src="/images/wallet.svg"
                  alt="wallet"
                  loading="eager"
                  className="object-fit-contain rotate"
                />
                <WalletConnection />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <section className="hero-section custom-bg-dark pb-5" id="home">
        <div className="container">
          <div className="row align-items-center row-gap-5">
            <div className="fade col-lg-6">
              <h1 className="text-light fw-light">
                Modern, Technology Farming <br /> that uses{" "}
                <mark className="fw-bold">Blockchain</mark>
              </h1>

              <p className="pt-4 text-light fw-lighter">
                EcoFarmTech is a cutting-edge agricultural company that
                leverages blockchain technology to revolutionize sustainable
                farming practices. By providing farmers with transparent,
                tamper-proof data on crop management, supply chain logistics,
                and consumer preferences, EcoFarmTech fosters efficiency,
                traceability, and accountability in food production. <br />{" "}
                <br />
                <span className="text-green fw-normal">
                  EcoFarmTech cultivates a new era of agriculture that
                  harmonizes innovation with environmental stewardship.
                </span>
              </p>
              <div className="d-flex flex-column flex-md-row gap-2 pt-5 pb-4">
                <a
                  href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                  target="_blank"
                  className="btn btn-success"
                >
                  Start Now
                  <img
                    src="/images/arrowtop.svg"
                    alt="wallet"
                    loading="eager"
                    className="object-fit-contain"
                  />
                </a>
                <a
                  href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                  target="_blank"
                  className="btn btn-outline-light"
                >
                  Learn More
                  <img
                    src="/images/arrowtop.svg"
                    alt="wallet"
                    loading="eager"
                    className="object-fit-contain"
                  />
                </a>
                <img
                  src="/images/herodecoration.svg"
                  alt="decoration"
                  loading="eager"
                  className="object-fit-contain ps-3 py-3"
                  width={112}
                />
              </div>
              <small className="fw-lighter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
                ipsum suspendisse ultrices gravida. Risus commodo viverra
                maecenas accumsan lacus vel facilisis.
              </small>
            </div>
            <div className="fade col-lg-6">
              <img
                src="/images/herorectangle2.png"
                alt="revolutionary method blockchain"
                className="object-fit-contain"
                loading="eager"
                width={"100%"}
                height={"auto"}
              />
            </div>
          </div>
          <div className="row pt-3">
            <a
              href="#ICO"
              className="d-flex gap-1 flex-column align-items-center text-light text-decoration-none lh-1"
            >
              <span className="text-green">Scroll down</span>
              for more content
              <img
                src="/images/arrowbottomgreen.svg"
                alt="arrow bottom"
                loading="eager"
                className="object-fit-contain"
              />
            </a>
          </div>
        </div>
      </section>

      <section className="ico-section custom-bg-light pt-5" id="ICO">
        <div className="container">
          {/* crowdsale */}
          <div className="d-flex flex-column flex-sm-row gap-2 align-items-center justify-content-sm-between crowdsale">
            <h2 className="h3">Crowdsale</h2>
            <a
              href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
              target="_blank"
              className="btn btn-outline-dark"
              style={{ width: "fit-content" }}
            >
              How to buy?
              <img
                src="/images/arrowtop.svg"
                alt="wallet"
                loading="eager"
                className="object-fit-contain"
              />
            </a>
          </div>

          <div className="row pt-4 pb-5 crowdsale">
            <div className="fade col-lg-12">
              <div
                className="progress"
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar position-relative overflow-visible"
                  style={{ width: "0%" }}
                  data-width={risingData}
                >
                  <div className="progress-bar-tooltip position-absolute">
                    <strong>${risingData}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade col-lg-12 d-flex justify-content-end">
              <span>${targetAmounts}</span>
            </div>
          </div>
          {/* round */}
          <div className="row pt-5">
            <div className="fade col-lg-12">
              <div className="fade card">
                <div className="fade card-body text-center position-relative pt-4 pb-4">
                  <img
                    src="/images/vectorobject.svg"
                    alt="object"
                    loading="lazy"
                    className="object-fit-contain position-absolute start-0 top-0 ps-4 pt-3"
                  />
                  <h3 className="fw-light h4">
                    Round
                    <strong className="fw-bold  "> {round}</strong>
                  </h3>
                  <p>Ico {days || "0"} days left!</p>
                  <div className="d-flex gap-2 justify-content-center round-calendar">
                    <div className="fade card">
                      <div className="fade card-body">
                        <p className="m-0">
                          <strong>{days || "0"}</strong> <br />
                          Days
                        </p>
                      </div>
                    </div>
                    <div className="fade card">
                      <div className="fade card-body">
                        <p className="m-0">
                          <strong>{hours || "0"}</strong> <br />
                          Hr
                        </p>
                      </div>
                    </div>
                    <div className="fade card">
                      <div className="fade card-body">
                        <p className="m-0">
                          <strong>{minutes || "0"}</strong> <br />
                          Min
                        </p>
                      </div>
                    </div>
                    <div className="fade card">
                      <div className="fade card-body">
                        <p className="m-0">
                          <strong>{seconds || "0"}</strong> <br />
                          Sec
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade col-lg-12 pt-4">
              <div className="fade card custom-bg-dark">
                <div className="fade card-body">
                  <div className="row">
                    <div className="fade col-md-4">
                      <p className="text-light fw-lighter text-center mt-3">
                        <strong className="text-green fw-bold h5">
                          ${price}
                        </strong>{" "}
                        <br />
                        Current Price
                      </p>
                    </div>
                    <div className="fade col-md-4 custom-borders">
                      <p className="text-light fw-lighter text-center mt-3">
                        <strong className="text-green fw-bold h5">
                          ${listPrice}
                        </strong>{" "}
                        <br />
                        Final Round Price
                      </p>
                    </div>
                    <div className="fade col-md-4">
                      <p className="text-light fw-lighter text-center mt-3">
                        <strong className="text-green fw-bold h5">
                          ${listPrice}
                        </strong>{" "}
                        <br />
                        Listing Price
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade col-lg-6 pt-4 d-flex">
              <div className="fade card custom-bg-cream py-3 w-100">
                <div className="fade card-body text-center">
                  <div className="d-flex w-100">
                    <Apple
                      onTokenAmountsUpdate={handleTokenAmountsUpdate}
                      onEtherAmountChange={handleEtherAmountChange}
                      selectedCoin={selectedCoin}
                      setSelectedCoin={setSelectedCoin}
                    />
                    <div className="custom-select w-100" data-title="">
                      <select
                        className="form-select"
                        style={{
                          backgroundColor: "#f1e6de",
                          wWidth: "100%",
                          marginInline: "auto",
                        }}
                        onChange={handleChanges}
                        value={selectedCoin}
                      >
                        <option value="usdt">USDT</option>
                        <option value="bnb">BNB</option>
                        <option value="bitcoin">USDC</option>
                      </select>

                      <div
                        className="custom-select-coin"
                        style={{
                          userSelect: "none",
                          pointerEvents: "none",
                        }}
                      >
                        <img
                          src={`/images/${selectedCoin}.svg`}
                          alt={selectedCoin}
                          loading="lazy"
                          className="object-fit-contain"
                          width={23}
                          height={"auto"}
                        />
                        <small className="fw-bold">
                          {selectedCoin.toUpperCase()}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Display the amount user will receive */}
                <div className="text-center py-5">
                  <span>You get</span>
                  <div className="d-flex gap-2 align-items-center justify-content-center pt-2">
                    <img
                      src="/images/vectorgreenobject.svg"
                      alt="object green"
                      loading="lazy"
                      className="object-fit-contain rotate"
                    />
                    <strong className="h3 m-0">
                      <p>{(selectedTokenAmount / 1e18).toFixed()}</p>
                    </strong>
                  </div>
                </div>

                <button
                  className="btn btn-success fit-content"
                  style={{ marginInline: "auto" }}
                  onClick={handleBuyClick}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Buy Tokens"}
                </button>
              </div>
            </div>
            <div className="fade col-lg-6 pt-4 d-flex">
              <div className="fade card custom-bg-cream py-3 px-3 w-100">
                <div className="fade card-body d-flex gap-4 flex-column justify-content-between">
                  <div>
                    {/* <p>
                      Your current status - <span>no any</span>
                    </p> */}
                    <p>
                      Referral reward earned: <strong>{rewads} ETF</strong>
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-4 justify-content-between">
                    <p>
                      Your total invesment <br />
                      <strong className="h4">${investment}</strong>
                    </p>
                    <p>
                      Balance EFT <br />
                      <strong className="h4">
                        <img
                          src="/images/vectorgreenobject.svg"
                          alt="object green"
                          loading="lazy"
                          className="object-fit-contain pe-1 rotate"
                        />
                        {balance}
                      </strong>
                    </p>
                    {/* <p>
                      Potential Listing Value <br />
                      <strong className="h4">${potentional}</strong>
                    </p> */}
                  </div>
                  {/* <div style={{ width: "60%" }}>
                    <p>Your level bonus</p>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="progress w-100"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="80"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ height: "14px", backgroundColor: "#dfe4cc" }}
                      >
                        <div
                          className="progress-bar custom-bg-green"
                          style={{ width: "25%" }}
                          data-width="25"
                        ></div>
                      </div>
                      <span>100%</span>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="fade col-lg-6 pt-4 d-flex">
              <div className="fade card custom-bg-cream py-2 w-100">
                <div className="fade card-body text-center">
                  <div className="text-center pb-5">
                    <span>
                      Refer a friend promotion with a <strong>Bonus</strong>
                    </span>
                  </div>
                  <div className="d-flex gap-3 flex-wrap flex-md-nowrap flex-lg-wrap flex-xl-nowrap">
                    {/* <button
                      className="btn btn-success fit-content"
                      style={{ marginInline: "auto" }}
                      onClick={generateCode}
                    >
                      Generate
                    </button> */}
                    <button
                      className="btn btn-success fit-content"
                      style={{ marginInline: "auto" }}
                      onClick={() => {
                        const link = generateReferralLink();
                        if (link) navigator.clipboard.writeText(link);
                      }}
                    >
                      Generate
                    </button>
                    <div className="generated-code ">
                      <span className="sspan">{link}</span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(generateReferralLink())
                        }
                      >
                        copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* our vision */}
        <img
          src="/images/waves.png"
          alt="waves"
          loading="lazy"
          width={"100%"}
          height={"auto"}
          className="waves"
        />
        <div className="container-fluid custom-bg-dark pb-5">
          <div className="container pb-5">
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <h2 className="text-light h3">Our Vision</h2>
              <img
                src="/images/ECOFARMTECH.png"
                alt="ecofarmtech"
                loading="lazy"
                style={{ maxWidth: "100%" }}
                className="fade"
              />
            </div>
            <div className="fade card custom-bg-dark">
              <div className="fade card-body">
                <p className="px-3 py-3 text-light fw-lighter">
                  <strong className="text-green">
                    The ECOFARMTECH (EFT) project ICO
                  </strong>
                  is dedicated to raising funds for the creation and development
                  of an innovative platform that aims to revolutionize modern
                  agriculture. Our vision includes building an integrated
                  community of farmers, offering tools and services that will
                  increase efficiency and productivity. <br /> <br />
                  <strong style={{ color: "#b6a8a6" }}>
                    Through tokenization, we want to introduce modern
                    technologies to the agricultural sector, making resources
                    more accessible and operational processes more automated.
                  </strong>
                  <br /> <br />
                  <strong className="text-green">The goal of the ICO</strong> is
                  not only to create a platform, but also to rebrand and expand
                  to international markets. We want ECOFARMTECH to become a
                  global platform offering comprehensive agricultural services
                  worldwide. Through tokenization and blockchain technology, we
                  will provide users with safe and transparent transactions,
                  regardless of their location.
                </p>
              </div>
            </div>
            <div className="row py-5">
              <div className="fade col-lg-4 d-flex align-items-end justify-content-center">
                <img
                  src="/images/ourvision.png"
                  alt="our vision"
                  loading="lazy"
                  className="object-fit-contain"
                  style={{ maxWidth: "100%" }}
                />
              </div>
              <div className="fade col-lg-8">
                <h3 className="pb-3">
                  <mark>ETF in steps</mark>
                </h3>
                <svg
                  version="1.2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 14 20"
                  width="14"
                  height="20"
                >
                  <g id="Our vision">
                    <g id="1 2 3">
                      <path
                        id="Arrow 7 1"
                        fill="#bee41b"
                        d="m5.6 0v14.7l-5.6-5.6v4l7 6.9 7-6.9v-4l-5.6 5.6v-14.7z"
                      />
                    </g>
                  </g>
                </svg>
                <div className="row pt-4">
                  <div className="fade col-lg-1 d-flex flex-column gap-2 pb-3 pb-lg-0">
                    <strong className="text-light">01</strong>
                    <svg
                      version="1.2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1 172"
                      width="1"
                      height="118"
                      style={{ marginInlineStart: "10px" }}
                    >
                      <path fill="#41372d" d="m0 0h1v172h-1z" />
                    </svg>
                  </div>
                  <div className="fade col-lg-3">
                    <strong className="text-green">
                      Our vision to <br /> create a global <br /> platform
                    </strong>
                  </div>
                  <div className="fade col-lg-8">
                    <p className="text-light fw-lighter">
                      <strong style={{ color: "#b6a8a6" }}>
                        Our vision is to create a global platform
                      </strong>{" "}
                      that will set new standards in the agriculture industry,
                      providing the{" "}
                      <strong style={{ color: "#b6a8a6" }}>
                        highest quality services with full transparency and
                        security of transactions
                      </strong>
                      . Using blockchain technology and tokenization, we aim to
                      transform the way farmers and agricultural service
                      providers cooperate, creating a more trusted, fair and
                      efficient business environment.
                    </p>
                  </div>
                </div>

                <div className="row py-4">
                  <div className="fade col-lg-1 d-flex flex-column gap-2 pb-3 pb-lg-0">
                    <strong className="text-light">02</strong>
                    <svg
                      version="1.2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1 172"
                      width="1"
                      height="172"
                      style={{ marginInlineStart: "10px" }}
                    >
                      <path fill="#41372d" d="m0 0h1v172h-1z" />
                    </svg>
                  </div>
                  <div className="fade col-lg-3">
                    <strong className="text-green">What we want</strong>
                  </div>
                  <div className="fade col-lg-8">
                    <p className="text-light fw-lighter">
                      We want ECOFARMTECH to{" "}
                      <strong style={{ color: "#b6a8a6" }}>
                        become an inseparable part of the daily lives of
                        millions of farmers around the world
                      </strong>
                      , offering solutions that meet their needs in a wide range
                      of agricultural services, such as machinery rental, land
                      leasing, agronomic services, crop monitoring, agricultural
                      advisory services, and access to innovative technologies
                      such as drones and advanced data analytics. We believe
                      that thanks to our platform, both farmers and service
                      providers will benefit from modern technologies that will
                      increase convenience, save time and ensure full security
                      of transactions.
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="fade col-lg-1 d-flex flex-column gap-2 pb-3 pb-lg-0">
                    <strong className="text-light">03</strong>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      version="1.2"
                      viewBox="0 0 11 121"
                      width="11"
                      height="121"
                      style={{ marginInlineStart: "5px" }}
                    >
                      <path fill="#41372d" d="m5 0h1v118h-1z" />
                      <path
                        fill="#41372d"
                        d="m5.6 111c2.6 0 4.6 2.1 4.6 4.6 0 2.6-2 4.6-4.6 4.6-2.5 0-4.6-2-4.6-4.6 0-2.5 2.1-4.6 4.6-4.6z"
                      />
                    </svg>
                  </div>
                  <div className="fade col-lg-3">
                    <strong className="text-green">
                      Future of <br /> EcoFarmTech
                    </strong>
                  </div>
                  <div className="fade col-lg-8">
                    <p className="text-light fw-lighter">
                      In the future, we plan to expand our operations to new
                      markets, introduce innovative features and services, and
                      establish cooperation with key partners in the industry to
                      jointly create a better and more sustainable environment
                      for agriculture. Our goal is not only to revolutionize the
                      agricultural services market, but also to set new
                      standards of quality and transparency that will become a
                      reference point for the entire industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade card custom-bg-dark">
              <div className="fade card-body">
                <p className="px-3 py-3 text-light fw-lighter">
                  With <strong className="text-green">ECOFARMTECH 2.0</strong>,{" "}
                  <strong style={{ color: "#b6a8a6" }}>
                    we will expand the range of services offered by our platform
                    to cover all aspects of farm management
                  </strong>
                  . The new version of the application will offer everything
                  needed for modern farming, from machinery rental, land lease,
                  agricultural advisory, crop monitoring, to specialized
                  agronomic services and crop exchange. The new{" "}
                  <strong className="text-green">ECOFARMTECH 2.0 </strong>
                  application will introduce the possibility of making payments
                  both by traditional methods (with a commission for the
                  application) and by using EFT tokens. Additionally, the
                  application will include a built-in marketplace where farmers
                  will be able to buy products necessary for running the farm.
                  <br /> <br />
                  In response to the growing expectations and demand of users,
                  <strong style={{ color: "#b6a8a6" }}>
                    {" "}
                    ECOFARMTECH will provide comprehensive solutions that meet
                    the main requirements of both farmers and agricultural
                    service providers
                  </strong>
                  . Our platform will not only meet the current needs of the
                  market, but also set new standards of quality and
                  transparency, becoming a model for the entire industry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="why-ecofarmtech py-5"
        style={{
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "cover",
        }}
      >
        <div className="container pt-4">
          <h2 className="h3">Why EcoFarmTech?</h2>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 pt-5 pb-5">
            <div className="col">
              <div className="fade card h-100 custom-bg-green py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/chat.svg"
                    alt="chat"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Chat</h3>
                  <p className="fade card-text pt-3">
                    Have questions about our platform or need support? Our chat
                    is a quick and easy way to get answers to all your
                    questions. Get in touch with our team, who are available to
                    help you at any time. Whether you want to learn more about
                    our products, investing in $EFT, or need technical support,
                    we are here for you!
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-dark align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/market.svg"
                    alt="market"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Market</h3>
                  <p className="fade card-text pt-3">
                    The EcoFarmTech marketplace is a place where farmers and
                    investors can directly trade resources, lease land, sell and
                    buy agricultural equipment and services. With our
                    blockchain-based platform, every user gains secure and
                    transparent access to the marketplace, which enables
                    efficient management of agricultural resources. Whether you
                    want to invest in agricultural projects, rent land or trade
                    agricultural products, EcoFarmTech gives you all the tools
                    to grow your business and support sustainable development.
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/fireradar.svg"
                    alt="fireradar"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Fire Radar</h3>
                  <p className="fade card-text pt-3">
                    Fire Radar is an advanced system for monitoring weather
                    threats, such as storms and fires, that is designed to
                    protect your crops and investments. Our radars operate in
                    real time, providing accurate information about potential
                    threats that could affect your crops. In addition,
                    integration with photovoltaic systems enables optimal energy
                    management in the event of extreme weather conditions,
                    ensuring uninterrupted protection and productivity for your
                    farm. With Fire Radar, you are assured that your crops are
                    safe, and you can focus on growing them.
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/landlease.svg"
                    alt="landlease"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Land Lease</h3>
                  <p className="fade card-text pt-3">
                    EcoFarmTech's Land Lease platform is an innovative solution
                    that enables landowners and investors to effectively manage
                    agricultural land. With our system you can quickly and
                    securely lease land or rent it on favorable terms. Our
                    blockchain-based technology ensures full transparency and
                    security of transactions. Whether you are a farmer looking
                    for additional resources or an investor interested in
                    leasing land, EcoFarmTech gives you flexible tools to manage
                    and develop your assets.
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/education.svg"
                    alt="education"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Education</h3>
                  <p className="fade card-text pt-3">
                    At EcoFarmTech, we believe that education is the key to
                    sustainable and efficient agriculture. Our education
                    platform offers a wide range of resources to help farmers,
                    investors and high-tech enthusiasts gain knowledge about
                    innovative agricultural solutions. From online courses to
                    webinars to expert articles, our educational resources will
                    keep you up to date on the latest trends and technologies.
                    Join us to develop your skills and support the future of
                    sustainable agriculture.
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex flex-column align-items-center gap-1">
                  <img
                    src="/images/blockchain.svg"
                    alt="blockchain"
                    loading="lazy"
                    className="object-fit-contain"
                  />
                  <h3 className="fade card-title h5">Blockchain</h3>
                  <p className="fade card-text pt-3">
                    Blockchain technology is the foundation of EcoFarmTech,
                    guaranteeing transparency, security and trust in every
                    transaction. With blockchain, we can tokenize agricultural
                    resources, allowing investors and farmers to collaborate
                    securely and without intermediaries. All data is
                    decentralized and stored immutably, providing full control
                    over financing and resource management processes. Blockchain
                    at EcoFarmTech is an innovative solution that drives the
                    development of modern agriculture and gives everyone the
                    opportunity to participate in this revolution.
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end mt-auto"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="fade card mt-5 mb-5 border-dashed"
            style={{
              backgroundImage: "url(/images/rectangle.png)",
              backgroundSize: "cover",
              transform: "scale(0.98)",
            }}
          >
            <div className="fade card-body d-lg-flex flex-wrap align-items-center justify-content-between gap-3">
              <div className="py-2 ps-5 position-relative">
                <img
                  src="/images/walletsquare.png"
                  alt="wallet"
                  loading="lazy"
                  className="object-fit-contain position-absolute custom-position"
                />
                <h3 className="text-green ps-5 ps-sm-0">
                  How to link wallets and buy $EFT tokens?
                </h3>
                <p className="fw-lighter text-light ps-5 ps-sm-0">
                  <ol className="ps-3">
                    <li>
                      Set up a Solana-compatible wallet - Install a wallet, such
                      as Phantom or Sollet, available for computer and mobile
                      devices.
                    </li>
                    <li>
                      Connect your wallet to EcoFarmTech - On the home page,
                      click the “Connect Wallet” button. You will be prompted to{" "}
                      <br />
                      authorize your wallet in our system.
                    </li>
                    <li>
                      Buy $EFT tokens - After connecting your wallet, go to the
                      token purchase section. Enter the number of tokens you
                      want to buy <br /> and confirm the transaction. Make sure
                      you have enough Solana (SOL) to cover the transaction.
                    </li>
                    <li>
                      Approve the purchase - Once the transaction is approved,
                      the $EFT tokens will be automatically added to your
                      wallet.
                    </li>
                  </ol>
                </p>
              </div>
              <a
                href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                target="_blank"
                className="btn btn-success mx-3"
              >
                <img
                  src="/images/wallet.svg"
                  alt="wallet"
                  loading="lazy"
                  className="object-fit-contain rotate"
                />
                Connect
              </a>
            </div>
          </div>
        </div>

        <section className="container pt-5" id="roadmap">
          <h2 className="h3">Roadmap</h2>
          <div className="custom-bg-green fade card px-5 py-2 mt-5">
            <div className="fade card-body d-flex flex-column flex-md-row gap-4 align-items-md-center align-items-start">
              <img
                src="/images/note.png"
                alt="note"
                loading="lazy"
                className="object-fit-contain"
              />
              <p className="m-0">
                <strong>
                  EcoFarmTech aims to become a leading platform in the
                  agriculture industry
                </strong>
                , using blockchain technology to ensure transparency, security
                and efficiency. <br />
                Below is a detailed{" "}
                <strong>
                  roadmap for the next 12 months, starting November 1, 2024.
                </strong>
              </p>
            </div>
          </div>
          <div className="row pt-5 pb-5 row-gap-5 custom-grid">
            <div className="col">
              <div className="fade card h-100 custom-bg-green py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 173 15"
                    width="173"
                    height="15"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: "-210px",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m109.2 11h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m114.2 11h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m124.2 11h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m141.5 11h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m4.2 14h-3.5l4.7-11.9h2.9l4.8 11.9h-3.7l-1.9-5.2q-0.2-0.5-0.3-0.9-0.1-0.4-0.2-0.7-0.1-0.3-0.2-0.7-0.1-0.4-0.2-0.9h0.5q-0.1 0.5-0.2 0.9-0.1 0.4-0.2 0.7-0.1 0.3-0.2 0.7-0.2 0.4-0.4 0.9zm6.4-1.8h-7.6l1.1-2.5h5.5zm3.4 1.8v-9.1h3.2l0.1 1.8-0.7 0.2q0.2-0.6 0.7-1.1 0.4-0.5 1.1-0.8 0.7-0.3 1.5-0.3 1 0 1.7 0.4 0.7 0.5 1.1 1.3 0.4 0.8 0.4 2v5.6h-3.5v-5.3q0-0.4-0.1-0.7-0.1-0.2-0.4-0.3-0.2-0.2-0.5-0.2-0.3 0-0.5 0.1-0.2 0.1-0.4 0.2-0.1 0.2-0.2 0.4-0.1 0.2-0.1 0.4v5.4h-1.7q-0.7 0-1.1 0-0.4 0-0.6 0zm20.7 0h-3.4v-9.1h3.4zm-1.7-10.7q-0.9 0-1.4-0.5-0.6-0.4-0.6-1.2 0-0.7 0.6-1.1 0.5-0.5 1.4-0.5 0.9 0 1.4 0.4 0.6 0.4 0.6 1.2 0 0.7-0.6 1.2-0.5 0.5-1.4 0.5zm7.4 10.9q-1.2 0-2-0.6-0.9-0.6-1.4-1.7-0.5-1-0.5-2.4 0-1.4 0.5-2.5 0.5-1.1 1.4-1.7 0.9-0.6 2-0.6 0.6 0 1.1 0.2 0.6 0.1 1 0.5 0.4 0.2 0.7 0.6 0.3 0.4 0.4 0.9l-0.7 0.2v-5.7h3.4v12.6h-3.1l-0.3-2 0.7 0.2q0 0.4-0.3 0.8-0.3 0.3-0.8 0.6-0.4 0.3-1 0.4-0.5 0.2-1.1 0.2zm1-2.8q0.5 0 0.8-0.2 0.4-0.3 0.6-0.7 0.1-0.4 0.1-1 0-0.6-0.1-1.1-0.2-0.4-0.6-0.6-0.3-0.3-0.8-0.3-0.5 0-0.8 0.3-0.4 0.2-0.6 0.6-0.1 0.5-0.1 1.1 0 0.6 0.1 1 0.2 0.4 0.6 0.7 0.3 0.2 0.8 0.2zm11.5 2.8q-1.5 0-2.7-0.6-1.1-0.7-1.7-1.7-0.6-1.1-0.6-2.5 0-1 0.3-1.8 0.3-0.9 0.9-1.5 0.7-0.7 1.5-1 0.9-0.4 1.9-0.4 1 0 1.8 0.4 0.8 0.3 1.4 1 0.6 0.6 0.9 1.5 0.3 0.8 0.3 1.8v0.8h-7.1l-0.4-1.7h4.7l-0.3 0.4v-0.3q0-0.3-0.1-0.6-0.2-0.2-0.5-0.4-0.3-0.1-0.7-0.1-0.5 0-0.8 0.2-0.3 0.2-0.5 0.6-0.2 0.3-0.2 0.9 0 0.6 0.3 1 0.2 0.5 0.7 0.8 0.6 0.2 1.3 0.2 0.5 0 0.9-0.1 0.4-0.1 0.8-0.4l1.6 2.2q-0.7 0.5-1.3 0.8-0.6 0.2-1.2 0.4-0.6 0.1-1.2 0.1zm8.8 0q-1.1 0-2-0.6-0.9-0.7-1.4-1.7-0.5-1.1-0.5-2.5 0-1.3 0.5-2.4 0.5-1.1 1.4-1.7 0.9-0.6 2.1-0.6 0.6 0 1.1 0.2 0.5 0.2 0.9 0.5 0.4 0.3 0.7 0.7 0.3 0.4 0.5 0.8h-0.7v-2h3.4v9.1h-3.5v-2.2h0.8q-0.2 0.5-0.5 1-0.3 0.4-0.7 0.7-0.4 0.3-0.9 0.5-0.5 0.2-1.2 0.2zm1-2.8q0.5 0 0.9-0.3 0.3-0.2 0.5-0.6 0.2-0.4 0.2-1.1 0-0.6-0.2-1-0.2-0.4-0.5-0.7-0.4-0.2-0.9-0.2-0.5 0-0.8 0.2-0.3 0.3-0.5 0.7-0.2 0.4-0.2 1 0 0.7 0.2 1.1 0.2 0.4 0.5 0.6 0.3 0.3 0.8 0.3zm17.2 2.6h-3.4v-11.4h3.4zm1.5-6.2h-6.3v-2.9h6.3zm5.9 6.4q-1.5 0-2.6-0.6-1.2-0.6-1.9-1.7-0.6-1.1-0.6-2.4 0-1.4 0.6-2.5 0.7-1 1.9-1.6 1.1-0.7 2.6-0.7 1.5 0 2.6 0.7 1.2 0.6 1.8 1.6 0.7 1.1 0.7 2.5 0 1.3-0.7 2.4-0.6 1.1-1.8 1.7-1.1 0.6-2.6 0.6zm0-2.9q0.5 0 0.8-0.2 0.4-0.3 0.6-0.7 0.2-0.4 0.2-0.9 0-0.6-0.2-1-0.2-0.4-0.6-0.6-0.3-0.3-0.8-0.3-0.5 0-0.9 0.3-0.3 0.2-0.5 0.6-0.2 0.4-0.2 1 0 0.5 0.2 0.9 0.2 0.4 0.5 0.7 0.4 0.2 0.9 0.2zm7.9 2.9q-0.8 0-1.2-0.4-0.4-0.5-0.4-1.3 0-0.7 0.4-1.2 0.5-0.5 1.2-0.5 0.8 0 1.3 0.5 0.4 0.4 0.4 1.2 0 0.8-0.4 1.2-0.5 0.5-1.3 0.5zm4.8 0q-0.8 0-1.3-0.4-0.4-0.5-0.4-1.3 0-0.7 0.5-1.2 0.4-0.5 1.2-0.5 0.8 0 1.2 0.5 0.5 0.4 0.5 1.2 0 0.8-0.5 1.2-0.5 0.5-1.2 0.5zm4.7 0q-0.8 0-1.2-0.4-0.5-0.5-0.5-1.3 0-0.7 0.5-1.2 0.5-0.5 1.2-0.5 0.8 0 1.2 0.5 0.5 0.4 0.5 1.2 0 0.8-0.5 1.2-0.5 0.5-1.2 0.5z"
                    />
                  </svg>
                  <span className="fade card-number">01</span>
                  <span className="text-secondary">Q4 2024: ICO</span>
                  <h3 className="fade card-title h6">
                    <mark>ICO Launch (October 31, 2024)</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Launch of ICO phase to raise funds for platform development.
                    Smart contracts will be audited and implemented on Solana
                    blockchain. <br /> <br />{" "}
                    <strong>
                      Goal: Raise $4,000,000 by selling EFT tokens at a price of
                      $0.0004 per token.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-dark align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 3"
                    width="66"
                    height="3"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: "-110px",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m2.2 0h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 0h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 0h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 0h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 282"
                    width="66"
                    height="282"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      right: "-110px",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m2.2 0h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 0h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 0h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 0h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m66 1.5v279c0 0.8-0.7 1.5-1.5 1.5-0.8 0-1.5-0.7-1.5-1.5v-279c0-0.8 0.7-1.5 1.5-1.5 0.8 0 1.5 0.7 1.5 1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m2.2 279h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 279h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 279h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 279h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                  </svg>
                  <span className="fade card-number">02</span>
                  <span className="text-secondary">
                    Q1 2025: Initial Activities and Development
                  </span>
                  <h3 className="fade card-title h6">
                    <mark>Team Expansion</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Expanding the EcoFarmTech team by hiring additional
                    specialists. <br /> <br />
                    <strong>
                      Goal: Strengthening the development, marketing and
                      operations team.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 282"
                    width="66"
                    height="282"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      left: "-110px",
                      transform: "rotate(180deg)",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m2.2 0h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 0h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 0h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 0h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m66 1.5v279c0 0.8-0.7 1.5-1.5 1.5-0.8 0-1.5-0.7-1.5-1.5v-279c0-0.8 0.7-1.5 1.5-1.5 0.8 0 1.5 0.7 1.5 1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m2.2 279h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 279h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 279h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 279h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                  </svg>
                  <span className="fade card-number">03</span>
                  <span className="text-secondary">
                    Q1 2025: Initial Activities and Development
                  </span>
                  <h3 className="fade card-title h6">
                    <mark>Team Expansion</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Expanding the EcoFarmTech team by hiring additional
                    specialists. <br /> <br />
                    <strong>
                      Goal: Strengthening the development, marketing and
                      operations team.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 3"
                    width="66"
                    height="3"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%) rotate(180deg)",
                      right: "-110px",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m2.2 0h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 0h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 0h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 0h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <span className="fade card-number">04</span>
                  <span className="text-secondary">
                    Q1 2025: Initial Activities and Development
                  </span>
                  <h3 className="fade card-title h6">
                    <mark>Team Expansion</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Expanding the EcoFarmTech team by hiring additional
                    specialists. <br /> <br />
                    <strong>
                      Goal: Strengthening the development, marketing and
                      operations team.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <span className="fade card-number">05</span>
                  <span className="text-secondary">
                    Q1 2025: Initial Activities and Development
                  </span>
                  <h3 className="fade card-title h6">
                    <mark>Team Expansion</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Expanding the EcoFarmTech team by hiring additional
                    specialists. <br /> <br />
                    <strong>
                      Goal: Strengthening the development, marketing and
                      operations team.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 66 3"
                    width="66"
                    height="3"
                    className="position-absolute"
                    style={{
                      top: "50%",
                      transform: "translateY(-50%) rotate(180deg)",
                      right: "-110px",
                    }}
                  >
                    <path
                      fill="#baa89b"
                      d="m2.2 0h0.3c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-0.3c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m7.2 0h4.9c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-4.9c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m17.2 0h11.6c0.9 0 1.5 0.7 1.5 1.5 0 0.8-0.6 1.5-1.5 1.5h-11.6c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                    <path
                      fill="#baa89b"
                      d="m34.5 0h30c0.8 0 1.5 0.7 1.5 1.5 0 0.8-0.7 1.5-1.5 1.5h-30c-0.8 0-1.5-0.7-1.5-1.5 0-0.8 0.7-1.5 1.5-1.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="fade card h-100 py-2 px-3">
                <div className="fade card-body d-flex justify-content-between flex-column gap-1 position-relative">
                  <span className="fade card-number">06</span>
                  <span className="text-secondary">
                    Q1 2025: Initial Activities and Development
                  </span>
                  <h3 className="fade card-title h6">
                    <mark>Team Expansion</mark>
                  </h3>
                  <p className="fade card-text pt-2 pb-1">
                    Expanding the EcoFarmTech team by hiring additional
                    specialists. <br /> <br />
                    <strong>
                      Goal: Strengthening the development, marketing and
                      operations team.
                    </strong>
                  </p>
                  <a
                    href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                    target="_blank"
                    className="btn btn-light align-self-end"
                  >
                    More
                    <img
                      src="/images/arrowtop.svg"
                      alt="wallet"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section
        className="tokenomics py-5"
        style={{
          backgroundImage: "url(/images/bg2.jpg)",
          backgroundSize: "cover",
        }}
        id="tokenomics"
      >
        <div className="container mt-4 pb-5">
          <h2 className="h3">Tokenomics</h2>
          <div className="fade card px-5 py-2 mt-5">
            <div className="fade card-body d-flex flex-column flex-md-row gap-4 align-items-md-center align-items-start">
              <img
                src="/images/note.png"
                alt="note"
                loading="lazy"
                className="object-fit-contain"
              />
              <p className="m-0">
                The total supply of EFT tokens is{" "}
                <strong>30,000,000,000 EFT</strong>, with a carefully planned
                distribution that aims to support the development and promotion
                of the platform. Below is a detailed breakdown of the token
                allocation, their use, and{" "}
                <strong>
                  the financial plan to raise $4,000,000 during the ICO phase
                </strong>
                .
              </p>
            </div>
          </div>
          <h3 className="fw-lighter h4 pt-5 mt-3">Token Allocation</h3>
          <div className="row pt-4 gap-lg-0 gap-4">
            <div className="fade col-lg-5">
              <div
                className="fade card custom-bg-dark py-4 px-3"
                style={{
                  backgroundImage: "url(/images/bgrectangle.png)",
                  backgroundSize: "cover",
                }}
              >
                <div className="fade card-body">
                  <img
                    src="/images/ALLOCATION.png"
                    alt="etfallocation"
                    loading="lazy"
                    className="object-fit-contain"
                    style={{ maxWidth: "100%" }}
                  />
                  <div className="etfallocation d-flex flex-column gap-3 pt-5">
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">01</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="25"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="25"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">25%</strong> ICO
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">02</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="15"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="15"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">15%</strong> Marketing
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">03</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="20"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="20"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">20%</strong> Development
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">04</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="5"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">&nbsp;&nbsp;5%</strong>{" "}
                        Airdrops
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">05</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="10"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="10"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">10%</strong> Team
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">06</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="2.5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="2.5"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">2.5%</strong> CED & DEX
                        Listings
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">07</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="2.5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="2.5"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">2.5%</strong> NFT
                        development
                      </span>
                    </div>
                    <div className="etfallocation-item">
                      <span className="text-light fw-bold">08</span>
                      <div
                        className="progress w-50"
                        role="progressbar"
                        aria-label="Basic example"
                        aria-valuenow="5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar"
                          style={{ width: "0%" }}
                          data-width="5"
                        ></div>
                      </div>
                      <span className="text-light fw-lighter">
                        <strong className="text-green">&nbsp;&nbsp;5%</strong>{" "}
                        Liquidity
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade col-lg-7">
              <div className="fade card custom-bg-light py-4 px-2">
                <div className="fade card-body">
                  <p>
                    <strong>ETF Allocation</strong> <br />
                    <br />
                    ICO: <strong>7,500,000,000 EFT</strong> (25%) <br />
                    Marketing: <strong>4,500,000,000 EFT</strong> (15%) <br />
                    Development: <strong>6,000,000,000 EFT</strong> (20%) <br />
                    Airdrops: <strong>1,500,000,000 EFT</strong> (5%) <br />
                    Team: <strong>3,000,000,000 EFT</strong> (10%) <br />
                    Listing on CEX and DEX exchanges:{" "}
                    <strong>750,000,000 EFT</strong> (2.5%) <br />
                    NFT development: <strong>
                      750,000,000 EFT
                    </strong> (2.5%) <br />
                    Liquidity: <strong>1,500,000,000 EFT </strong> (5%)
                  </p>
                  <br />
                  <p>
                    <strong>Overall</strong> <br /> <br />
                    The tokenomics of the &quot;EcoFarmTech&quot; project have
                    been carefully planned to provide sufficient funds for key
                    aspects of the development and promotion of the platform.
                    With a total supply of <strong>30,000,000,000 EFT</strong>,
                    a significant portion (25%) has been allocated to the ICO
                    phase, which <strong>aims to raise 4,000,000 USD</strong>.
                    The remaining tokens are strategically placed for marketing,
                    development, airdrops, team remuneration, exchange listing,
                    NFT development and liquidity. This financial plan aims to
                    support &quot;EcoFarmTech&quot; in building a solid and
                    sustainable ecosystem, which will contribute to the success
                    of the platform in the competitive agricultural technology
                    market.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="faq-section pt-5"
        style={{
          backgroundImage: "url(/images/background.png)",
          backgroundSize: "cover",
        }}
      >
        <section className="container" id="team">
          <h2 className="h3 pt-5 pb-5">Need help?</h2>
          <div className="fade card custom-bg-light pb-5 px-lg-5 px-md-3">
            <div className="fade card-body">
              <div className="row">
                <div
                  className="col-lg-4 col-md-6 pt-5 h-100"
                  style={{ transform: "scale(0.9)" }}
                >
                  <div className="d-flex align-items-start gap-3 h-100">
                    <img
                      src="/images/chat2.svg"
                      alt="chat"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                    <div className="d-flex flex-column h-100">
                      <h3 className="h5 fw-bold">24/7 Chat Support</h3>
                      <p className="fw-light custom-height">
                        Our support team is available 24/7 to help you at any
                        time. Do you have questions about purchasing $EFT
                        tokens, how the platform works or any other issue?
                        Contact us via chat and our dedicated team will quickly
                        provide answers and support. We are here to make sure
                        your experience with EcoFarmTech is always positive and
                        hassle-free.
                      </p>
                      <a
                        href="https://ith-whitepaper.gitbook.io/ith/ecofarmtech"
                        target="_blank"
                        className="btn btn-success fit-content mt-auto"
                      >
                        Chat
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 col-md-6 pt-5 h-100"
                  style={{ transform: "scale(0.9)" }}
                >
                  <div className="d-flex align-items-start gap-3 h-100">
                    <img
                      src="/images/faq.svg"
                      alt="chat"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                    <div className="d-flex flex-column h-100">
                      <h3 className="h5 fw-bold">F.A.Q</h3>
                      <p className="fw-light custom-height">
                        Have questions about EcoFarmTech, $EFT tokens, or how
                        our platform works? Check out our FAQ section, where
                        you'll find answers to frequently asked questions.
                        You'll learn how our system works, how to invest in
                        sustainable agriculture, and how to use blockchain
                        technology in our ecosystem. If you don't find the
                        answer, our support team is always ready to help you!
                      </p>
                      <a
                        href="#faq"
                        className="btn btn-success fit-content mt-auto"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-4 col-md-6 pt-5 h-100"
                  style={{ transform: "scale(0.9)" }}
                >
                  <div className="d-flex align-items-start gap-3 h-100">
                    <img
                      src="/images/community.svg"
                      alt="chat"
                      loading="lazy"
                      className="object-fit-contain"
                    />
                    <div className="d-flex flex-column h-100">
                      <h3 className="h5 fw-bold">Community</h3>
                      <p className="fw-light custom-height">
                        The EcoFarmTech community is the heart of our project.
                        We connect people from all over the world who share a
                        passion for modern technology and sustainable
                        agriculture. Our members are farmers, investors,
                        blockchain technology enthusiasts and ecology
                        enthusiasts. Join us, participate in discussions, AMA
                        sessions, as well as online and live events. Together,
                        we are creating innovative solutions that are changing
                        the future of global agriculture.
                      </p>
                      <a
                        href="https://x.com/EcoFarmTech"
                        target="_blank"
                        className="btn btn-success fit-content mt-auto"
                      >
                        Join
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container pt-5 mt-5" id="faq">
          <h2 className="h5 fw-bold">Frequently Asked Questions</h2>
          <div className="accordion" id="accordionExample">
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  1. What is the $EFT token and how can I use it?
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    The $EFT token is a digital currency created within the
                    EcoFarmTech ecosystem, designed to support sustainable
                    agricultural projects. You can use $EFT tokens to invest in
                    farming initiatives, lease land, purchase agricultural
                    products, and exchange resources on our platform. Holding
                    $EFT also grants access to exclusive offers and discounts.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  2. What are the main benefits of investing in $EFT?
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    Investing in $EFT provides access to the rapidly growing
                    sector of sustainable agriculture. Through our
                    blockchain-based system, investments are secure,
                    transparent, and easy to track. Additionally, $EFT allows
                    you to support innovative agricultural projects that promote
                    ecological and modern solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  3. How does blockchain technology support agriculture at
                  EcoFarmTech?
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    Blockchain technology at EcoFarmTech enables transparent
                    tracking of transactions, tokenization of agricultural
                    resources, and secure investments. By utilizing blockchain,
                    we eliminate middlemen, reducing operational costs and
                    speeding up financial processes in agriculture while
                    ensuring trust throughout the ecosystem.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="false"
                  aria-controls="collapseFour"
                >
                  4. Are there any risks associated with investing in $EFT?
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    Like any investment, $EFT comes with some risks.
                    Cryptocurrency market volatility, the development of
                    agricultural technologies, and the success of the projects
                    you invest in can all affect the value of your tokens. We
                    always recommend thoroughly reviewing our projects and
                    diversifying your investments.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFive"
                  aria-expanded="false"
                  aria-controls="collapseFive"
                >
                  5. How does EcoFarmTech support sustainable agriculture?
                </button>
              </h2>
              <div
                id="collapseFive"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    EcoFarmTech focuses on supporting modern and eco-friendly
                    solutions in agriculture. Through our platform, we finance
                    projects that promote reducing water consumption, lowering
                    carbon footprints, better resource management, and
                    implementing smart farming technologies. By investing in
                    $EFT, you contribute to environmental protection and the
                    improvement of agricultural efficiency.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSix"
                  aria-expanded="false"
                  aria-controls="collapseSix"
                >
                  6. How can I start investing in agricultural projects using
                  $EFT?
                </button>
              </h2>
              <div
                id="collapseSix"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    To start investing, create a wallet compatible with Solana,
                    purchase $EFT tokens, and connect to our platform. Then
                    choose an agricultural project you wish to support and make
                    an investment using the tokens. All investments are fully
                    transparent, and you can track the progress of the projects
                    directly on our platform.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseSeven"
                  aria-expanded="false"
                  aria-controls="collapseSeven"
                >
                  7. Will the $EFT token be listed on exchanges?
                </button>
              </h2>
              <div
                id="collapseSeven"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    Yes, we plan to list the $EFT token on several popular
                    cryptocurrency exchanges after the ICO phase. This will
                    provide liquidity for the token, allowing investors to trade
                    and exchange it on various platforms. The listing date and
                    exchanges will be announced as we finalize our partnerships.
                  </p>
                </div>
              </div>
            </div>
            <div className="fade accordion-item border-0 pt-4">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed custom-bg-light ps-5 fw-normal"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseEight"
                  aria-expanded="false"
                  aria-controls="collapseEight"
                >
                  8. Will the $EFT token increase in value, and by how much?
                </button>
              </h2>
              <div
                id="collapseEight"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body px-0 py-4 fw-light">
                  <p>
                    The potential increase in the value of the $EFT token
                    depends on several factors, including the success of the
                    agricultural projects we support, market conditions, and
                    overall demand for sustainable agriculture solutions. While
                    we cannot guarantee specific growth, the long-term prospects
                    of sustainable farming and blockchain integration are
                    promising, which could positively impact the token's value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <img
          src="/images/waves.png"
          alt="waves"
          loading="lazy"
          width={"100%"}
          height={"auto"}
          className="waves"
        />
      </section>

      <footer className="position-relative">
        <div className="custom-bg-dark">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center flex-wrap py-5 gap-3">
              <a href="#">
                <img
                  src="/images/logo.png"
                  alt="ecofarmtech logo"
                  loading="lazy"
                  className="object-fit-contain"
                />
              </a>
              <ul className="navbar-nav nav-underline fw-lighter flex-row column-gap-5 flex-wrap">
                {["home", "ICO", "roadmap", "tokenomics", "team", "faq"].map(
                  (link) => (
                    <li className="nav-item" key={link}>
                      <a
                        className={`nav-link ${
                          activeLink === link
                            ? "active fw-lighter"
                            : "fw-lighter"
                        }`}
                        href={`#${link}`}
                        onClick={() => handleLinkClick(link)} // Set the active link on click
                      >
                        {link.charAt(0).toUpperCase() + link.slice(1)}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: "#120c07" }}>
          <div className="container">
            <div className="d-flex justify-content-between column-gap-5 flex-wrap align-items-center py-3 row-gap-3">
              <span
                className="text-light m-0 fw-lighter"
                style={{ fontSize: "13px" }}
              >
                All Rights Reserved by{" "}
                <strong>
                  <a
                    href="https://ecofarmtech.com/"
                    className="text-decoration-none text-light"
                  >
                    EcoFarmtech.com
                  </a>
                </strong>{" "}
                &copy;{currentYear} {" | "} Created With Love by{" "}
                <strong>
                  <a
                    href="https://agencjamedialna.pl/"
                    target="_blank"
                    title="AD Awards Media Agency in Legnica"
                    className="text-decoration-none text-light"
                  >
                    AD Awards
                  </a>
                </strong>
              </span>
              <ul className="socialmedia">
                <li>
                  <a href="#ig" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/instagram-svgrepo-com.svg"
                      alt="instagram"
                      loading="lazy"
                      width={14}
                      height={"auto"}
                      className="object-fit-contain"
                    />
                  </a>
                </li>
                <li>
                  <a href="#fb" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/facebook-176-svgrepo-com.svg"
                      alt="facebook"
                      loading="lazy"
                      width={15}
                      height={"auto"}
                      className="object-fit-contain"
                    />
                  </a>
                </li>
                <li>
                  <a href="#dc" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/discord-svgrepo-com.svg"
                      alt="discord"
                      loading="lazy"
                      width={16}
                      height={"auto"}
                      className="object-fit-contain"
                    />
                  </a>
                </li>
                <li>
                  <a href="#twitterx" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/twitter-x.svg"
                      alt="x or twitter"
                      loading="lazy"
                      width={13}
                      height={"auto"}
                      className="object-fit-contain"
                    />
                  </a>
                </li>
                <li>
                  <a href="#yt" target="_blank" rel="noopener noreferrer">
                    <img
                      src="/images/youtube.svg"
                      alt="youtube"
                      loading="lazy"
                      width={13}
                      height={"auto"}
                      className="object-fit-contain"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <button
          className="position-absolute top-0 rotate"
          id="scrollToTop"
          onClick={scrollToTop}
        >
          <svg
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 56 56"
            width="56"
            height="56"
          >
            <path
              fill="#bee41b"
              d="m28 0c15.5 0 28 12.5 28 28 0 15.5-12.5 28-28 28-15.5 0-28-12.5-28-28 0-15.5 12.5-28 28-28z"
            />
            <path
              fill="#1f160e"
              d="m33.8 32l-5.8-4.7-5.8 4.7-1.2-1.3 7-5.7 7 5.7z"
            />
          </svg>
        </button>
      </footer>
    </>
  );
}

export default App;
