let web3;
let contract;
let account;

const contractAddress = "0x6b06621a982f21e22fa594631cc9979e5afc7a51";

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_message",
				"type": "string"
			}
		],
		"name": "setMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "message",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

async function connectWallet() {
    try {
        if (!window.ethereum) {
            alert("MetaMask not detected");
            return;
        }

        web3 = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        account = accounts[0];
        document.getElementById("account").innerText = account;

        contract = new web3.eth.Contract(contractABI, contractAddress);

        alert("Wallet connected successfully");
    } catch (error) {
        console.error("Connect wallet error:", error);
        alert("Failed to connect wallet: " + error.message);
    }
}

async function getMessage() {
    try {
        if (!contract) {
            alert("Please connect wallet first");
            return;
        }

        document.getElementById("result").innerText = "Loading...";

        const message = await contract.methods.getMessage().call();
        document.getElementById("result").innerText = message;
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText = "Failed to fetch message";
    }
}

async function setMessage() {
    try {
        if (!contract || !account) {
            alert("Please connect wallet first");
            return;
        }

        const newMessage = document.getElementById("newMessage").value.trim();

        if (!newMessage) {
            alert("Please enter a message");
            return;
        }

        document.getElementById("result").innerText = "Waiting for transaction confirmation...";

        await contract.methods.setMessage(newMessage).send({ from: account });

        document.getElementById("result").innerText = "Message updated successfully!";
        document.getElementById("newMessage").value = "";
    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText = "Transaction failed or was cancelled";
    }
}