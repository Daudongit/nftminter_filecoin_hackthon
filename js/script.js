import MyContractABI from "./abi.js"

document.addEventListener("DOMContentLoaded", async () => {
  const contractAddress = "0x9b33ea10b8d31976fab247f97a1fde1b2001ef00"
    // let web3 = new Web3(window.ethereum)
    const ethereum = window.ethereum
    var userAccount = null
    let web3 = new Web3(ethereum)
    const contract = new web3.eth.Contract(MyContractABI, contractAddress)

    const walletConnectionButton = document.getElementById("wallet_connection_button")

    const setuserAccount = (ethereum, walletConnectionButton)=>{
      if (ethereum.selectedAddress){
        userAccount = ethereum.selectedAddress
        walletConnectionButton.classList.add("border-green-500")
      }
    }

    setuserAccount(ethereum, walletConnectionButton)
    
    walletConnectionButton.addEventListener("click", async () => {
      if (ethereum) {
        if (!ethereum.selectedAddress) {
          await ethereum.enable() // <<< ask for permission
        }
        setuserAccount(ethereum, walletConnectionButton)
        // userAccount = ethereum.selectedAddress
        // walletConnectionButton.classList.add("border-green-500")
        // web3 = new Web3(ethereum)
      }
      else {
        // ...< connect to local rpc >
      }
    })

    document.getElementById("load_nft_button").addEventListener("click", async () => {
      const walletAddress = document.getElementById("wallet_address").value
      contract.defaultAccount = userAccount || walletAddress
      const tokenId = await contract.methods.balanceOf(walletAddress).call()
      let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()
      const tokenMetadata = JSON.parse(tokenMetadataURI)
      document.getElementById("nfts").innerHTML = ""
      const spacePunkTokenElement = document.getElementById("nft_template").content.cloneNode(true)
      spacePunkTokenElement.querySelector("h1").innerText = tokenMetadata["name"]
      spacePunkTokenElement.querySelector("a").href = tokenMetadata["image"]
      spacePunkTokenElement.querySelector("img").src = tokenMetadata["image"]
      spacePunkTokenElement.querySelector("img").alt = tokenMetadata["description"]
      document.getElementById("nfts").append(spacePunkTokenElement)
    })

    document.getElementById("mint_button").addEventListener("click", async () => {
      if(userAccount){
        contract.defaultAccount = userAccount
      }else{
        alert('Please connect your wallet to complete the transaction')
        return
      }
      const mitingAddress = document.getElementById("miting_address").values
      const imageUrl = document.getElementById("image_url").value
      if(!mitingAddress || !imageUrl){
        alert('Please make sure that you enter a correct minting address and image url')
        return
      }
      await contract.methods.safeMint(mitingAddress, imageUrl).send()
      console.log("****** My addresss ******", userAccount)
      // console.log(web3.eth.accounts)
      // console.log(web3.currentProvider.selectedAddress)
    })
  })





// document.addEventListener("DOMContentLoaded", () => {
//   const web3 = new Web3(window.ethereum)

//   document.getElementById("load_button").addEventListener("click", async () => {
//     const contract = new web3.eth.Contract(SpacePunksTokenABI, "0x9b33ea10b8d31976fab247f97a1fde1b2001ef00")
//     const walletAddress = document.getElementById("wallet_address").value
//     contract.defaultAccount = walletAddress
//     const spacePunksBalance = await contract.methods.balanceOf(walletAddress).call()
    
//     document.getElementById("nfts").innerHTML = ""

//     for(let i = 0; i < spacePunksBalance; i++) {
//     //   const tokenId = await contract.methods.tokenURI(i).call()
//       const tokenId = await contract.methods.tokenURI(i).call()

//       let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()

//       if (tokenMetadataURI.startsWith("ipfs://")) {
//         tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
//       }

//       const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())

//       const spacePunkTokenElement = document.getElementById("nft_template").content.cloneNode(true)
//       spacePunkTokenElement.querySelector("h1").innerText = tokenMetadata["name"]
//       spacePunkTokenElement.querySelector("a").href = `https://opensea.io/assets/0x45db714f24f5a313569c41683047f1d49e78ba07/${tokenId}`
//       spacePunkTokenElement.querySelector("img").src = tokenMetadata["image"]
//       spacePunkTokenElement.querySelector("img").alt = tokenMetadata["description"]

//       document.getElementById("nfts").append(spacePunkTokenElement)
//     }
//   })
// })