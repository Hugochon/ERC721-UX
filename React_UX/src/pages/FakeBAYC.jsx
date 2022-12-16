import { useState, useEffect} from 'react'
import Web3 from 'web3'
import contract from '../../../build/contracts/FakeBAYC.json'
import { IpfsImage } from 'react-ipfs-image';

async function Sepoliaconnect() {
    const eth = window.ethereum
    await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask")); 
    const web3 = new Web3(eth)
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId()
    return {account:accounts[0], chainId}
  }

  function FakeBAYC() {

    const web3 = new Web3(window.ethereum);
    const contractAddress = "0x1dA89342716B14602664626CD3482b47D5C2005E";
    const contractInstance = new web3.eth.Contract(contract, contractAddress);
    const [Name, setName] = useState("")
    const [totalsupply, settotal] = useState(0)
    const [image, setimage] = useState("")
    const [attributes, setAttributes] = useState("")

    const [tokenNB, setTokenNB] = useState("")

    const [showInfo, setShowInfo] = useState(false)

    async function TokenInfo(tokenNB) {  
        
        setTokenNB(parseInt(tokenNB))   
        settotal(parseInt(totalsupply))
            
        console.log(tokenNB>totalsupply)
        if(tokenNB > totalsupply || tokenNB < 0){
            alert("This token doesn't exist")
          }
        else{
            let data = await contractInstance.methods.tokenURI(tokenNB).call()
            const jsonURI = await fetch(data).then(res => res.json());    
            setAttributes(JSON.stringify(jsonURI.attributes))
            setimage(jsonURI.image)
            setShowInfo(true)
        }
    }

    function handleChange(event) {
        setTokenNB(event.target.value);
    }
    function handleSubmit(event) {
        if(totalsupply==0){
            alert("You need to connect to the contract first")
        }
        else{
            event.preventDefault();
            console.log('Form submitted with text:', tokenNB);
            TokenInfo(tokenNB)
        }
    }

  return (
    <div>
        <h1>Fake Bayc</h1>
        <h3>Click on the connect button</h3>
        <p>Name : {Name}</p>
        <p>Total Supply : {totalsupply}</p>

        <button onClick={async () => {
            contractInstance.methods.totalSupply().call((err, result) => { settotal(result) })
            contractInstance.methods.name().call((err, result) => { setName(result) })
        }}>Connect</button>
        
        <button onClick={async () => {
            const result= await Sepoliaconnect()
            const account=result.account
            await contractInstance.methods.claimAToken().send({ from: account })
        }}>Claim a Token</button>
        

        <p>Get a specific token infos (enter the ID of the token you want and click submit. You may need to click twice.)</p>
        <form onSubmit={handleSubmit}>
        <textarea onChange={handleChange}></textarea>
        <button type="submit">Submit</button>
        </form>

        {showInfo && (
            <div>
                <p>Attributes : {attributes}</p>
                <p><IpfsImage hash={image}/></p>

            </div>     
         )}

    </div>
  )
}

export default FakeBAYC