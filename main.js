const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(from, to, amount){
        this.fromAddress = from;
        this.toAddress = to;
        this.amount= amount;
    }
}
class Block{
    constructor(timestamp, transactions, previousHash=""){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) != Array(difficulty + 1).join("0") || this.hash != this.calculateHash()){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 10;
    }
    createGenesisBlock(){
        return new Block("11/08/2018", "I am a serial killer", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                if(trans.toAddress == address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    isChainValid(){
        for(let i=1; i<this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            if(currentBlock.hash.substring(0, this.difficulty)!= Array(this.difficulty + 1).join("0"))   return false;
            if(currentBlock.hash != currentBlock.calculateHash())   return false;
            if(currentBlock.previousHash != prevBlock.hash) return false;
        }
        return true;
    }
}

let ujjawalCoin = new Blockchain();
ujjawalCoin.createTransaction(new Transaction('address1', 'address2', 100));
ujjawalCoin.createTransaction(new Transaction('address2', 'address1', 100));

console.log("starting the miner");
ujjawalCoin.minePendingTransactions("address3");
console.log("Balance of address3 is: ", ujjawalCoin.getBalanceOfAddress("address3"));

console.log("\n", ujjawalCoin);
console.log("starting the miner again");
ujjawalCoin.minePendingTransactions("address3");
console.log("Balance of address3 is: ", ujjawalCoin.getBalanceOfAddress("address3"));
