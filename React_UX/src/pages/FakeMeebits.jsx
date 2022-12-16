import { useState, useEffect} from 'react'
import Web3 from 'web3'
import contract from '../../../build/contracts/FakeMeebitsClaimer.json'
import sig from '../../../claimerV1-tools/output-sig.json'

async function Sepoliaconnect() {
    const eth =window.ethereum
    await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask"));
    const web3 = new Web3(eth)
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId()
    return {account:accounts[0], chainId}
  }


  function fakeMeebits() {

    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x5341e225Ab4D29B838a813E380c28b0eFD6FBa55";
    const contractInstance = new web3.eth.Contract(contract, contractAddress);
    const [tokenNB, setTokenNB] = useState(0)

    async function SelectYourToken(tokenNB) {

        setTokenNB(parseInt(tokenNB)) 
        let test = await contractInstance.methods.tokensThatWereClaimed(tokenNB).call()
        if(test == true){
            alert("This NFT has already been claimed")
        }
        else{
            const result= await Sepoliaconnect()
            const account=result.account
            const _signature = sig[tokenNB].signature; 
            await contractInstance.methods.claimAToken(tokenNB, _signature).send({ from: account})
            
        }
    }

    function handleChange(event) {
        setTokenNB(event.target.value);
    }
    function handleSubmit(event) {
        console.log(typeof(tokenNB))
        event.preventDefault();
        console.log('Form submitted with text:', tokenNB);
        SelectYourToken(tokenNB)
    }

  return (
    <div>
        <h1>Fake Meebits</h1>

        <p>Mint a Meebit NFT (enter the ID of the NFT you want to mint.) </p>
        <form onSubmit={handleSubmit}>
        <textarea onChange={handleChange}></textarea>
        <button type="submit">Mint</button>
        </form>

    </div>
  )
}

export default fakeMeebits