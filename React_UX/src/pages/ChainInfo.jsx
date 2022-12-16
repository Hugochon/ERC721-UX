import { useState, useEffect} from 'react'
import Web3 from 'web3'

async function Sepoliaconnect() {
  const eth = window.ethereum
  await eth.request({ method: "eth_requestAccounts" }).then(() => console.log("Connected to MetaMask"));
  const web3 = new Web3(eth)
  const accounts = await web3.eth.getAccounts()
  const chainId = await web3.eth.getChainId()
  const block = await web3.eth.getBlockNumber()
  console.log('chainId', chainId)
  console.log('accounts', accounts)
  console.log('block', block)
  return {account:accounts[0], chainId,block}
}

function ChainInfo() {

  const [chainID, setChainID] = useState(0)
  const [account, setAccount] = useState([])
  const [block, setBlock] = useState([])

  const [showInfo, setShowInfo] = useState(false)

  return (
    <div>
      <h1>Chain Info</h1>
      <h3>Click on the connect button to get the informations of the Chain</h3>
      <h3>you are currently connected to with your Metamask</h3>
        <button onClick={async () => {
            const result = await Sepoliaconnect()
            setChainID(result.chainId)
            setAccount(result.account)
            setBlock(result.block) 
            setShowInfo(true)                   
        }}>Connect Metamask</button>
        {showInfo && (
         <p><p>Account: {account}</p>Chain ID: {chainID}<p>Latest block : {block}</p></p>        
      )}
    </div>
  )
}

export default ChainInfo