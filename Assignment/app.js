let web3;
let contract;
let account;

const contractAddress = "0x4d0DCfFD86c7d183e9167F290f0013559426b40d";

const contractABI = [
	{
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Deposited",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Withdrawn",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getMyBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("Please install MetaMask");
            return;
        }

        web3 = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        account = accounts[0];
        document.getElementById("account").innerText = account;

        contract = new web3.eth.Contract(contractABI, contractAddress);
        document.getElementById("message").innerText = "Wallet connected successfully";
    } catch (error) {
        console.error(error);
        alert("Failed to connect wallet: " + error.message);
    }
}

async function depositETH() {
    try {
        if (!contract || !account) {
            alert("Please connect wallet first");
            return;
        }

        const amount = document.getElementById("amount").value.trim();
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        document.getElementById("message").innerText = "Waiting for deposit transaction...";

        await contract.methods.deposit().send({
            from: account,
            value: web3.utils.toWei(amount, "ether")
        });

        await getBalance();
        document.getElementById("message").innerText = "Deposit successful";
    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText = "Deposit failed or cancelled";
    }
}

async function withdrawETH() {
    try {
        if (!contract || !account) {
            alert("Please connect wallet first");
            return;
        }

        const amount = document.getElementById("amount").value.trim();
        if (!amount || Number(amount) <= 0) {
            alert("Please enter a valid amount");
            return;
        }

        document.getElementById("message").innerText = "Waiting for withdrawal transaction...";

        await contract.methods.withdraw(
            web3.utils.toWei(amount, "ether")
        ).send({
            from: account
        });

        await getBalance();
        document.getElementById("message").innerText = "Withdrawal successful";
    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText = "Withdrawal failed or cancelled";
    }
}

async function getBalance() {
    try {
        if (!contract || !account) {
            alert("Please connect wallet first");
            return;
        }

        document.getElementById("message").innerText = "Loading balance...";

        const balanceWei = await contract.methods.getMyBalance().call({ from: account });
        const balanceEth = web3.utils.fromWei(balanceWei, "ether");

        document.getElementById("balanceResult").innerText = balanceEth + " ETH";
        document.getElementById("message").innerText = "Balance fetched successfully";
    } catch (error) {
        console.error(error);
        document.getElementById("message").innerText = "Failed to fetch balance";
    }
}