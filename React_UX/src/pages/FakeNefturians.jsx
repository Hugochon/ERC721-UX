import { useState, useEffect} from 'react'
import Web3 from 'web3'
import contract from '../../../build/contracts/FakeNefturians.json'

async function Sepoliaconnect() {
    const eth = window.ethereum
    await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask"));
    const web3 = new Web3(eth)
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId()
    return {account:accounts[0], chainId}
  }

function fakeNefturians() {

    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x9bAADf70BD9369F54901CF3Ee1b3c63b60F4F0ED";
    const contractInstance = new web3.eth.Contract(contract, contractAddress);
    const [Name, setName] = useState("")
    const [Price, setPrice] = useState(0)
    const [Price2, setPrice2] = useState(0)

    const [userAddress, setUserAddress] = useState("")
    const [NFTlist, setList] = useState([]);

    const [showInfo, setShowInfo] = useState(false) 

    async function UserInfo(userAddress) {    

        let number = await contractInstance.methods.balanceOf(userAddress).call();  
        let temp = [];

        if(number == 0){
            alert("This adress doesn't have any NFTs")
        }
        for( let i = 0; i < number; i++){
          
            let tempTokenId = await contractInstance.methods.tokenOfOwnerByIndex(userAddress,i).call(); 
            let URI = await contractInstance.methods.tokenURI(tempTokenId).call();
            let fetchUri = await fetch(URI).then(res => res.json());  
            temp.push([tempTokenId ,fetchUri.image, fetchUri.name, fetchUri.description]);
            
        }
        setList(temp);   
        setShowInfo(true)
    }

    function handleChange(event) {
        setUserAddress(event.target.value);
    }
    function handleSubmit(event) {
        if(Name!="Fake Nefturians"){
            alert("You need to connect to the contract first")
        }
        else{
            event.preventDefault();
            console.log('Form submitted with text:', userAddress);
            UserInfo(userAddress)
        }
    }

  return (
    <div>
        <h1>Fake Nefturians</h1>
        <p>Name : {Name}</p>
        <p>Price : {Price2} ETH</p>
        <button onClick={async () => {
            const price = await contractInstance.methods.tokenPrice().call()
            setPrice(String(price*1.0001)) //For the gas fees
            setPrice2(web3.utils.fromWei(String(Price)))
            contractInstance.methods.name().call((err, result) => { setName(result) })
        }}>Connect (Click Twice)</button>
        
        <button onClick={async () => {
            const result= await Sepoliaconnect()
            const account=result.account
            await contractInstance.methods.buyAToken().send({ from: account, value:Price})
        }}>Buy a Token</button>
        
        <p>Get a specific user infos (enter the adress of the user) </p>
        <form onSubmit={handleSubmit}>
        <textarea onChange={handleChange}></textarea>
        <button type="submit">Submit</button>
        </form>

        {showInfo && (
            NFTlist.map((token,i)=>
            <li key={i}>
            Token ID : {token[0]}
            <br></br>
            Name : {token[2]}
            <br></br>
            <img src={token[1]}></img>
            <br></br>
            Description : {token[3]}
            <br></br>
            </li> ) 
         )}
    </div>
  )
}

export default fakeNefturians