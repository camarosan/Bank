const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require('truffle-assertions');

contract.skip("Dex", accounts =>{ // to skip the entire test
    it("The user must have ETH deposited such that deposit eth >= buy order value", async() =>{
        let dex = await Dex.deployed();
        await truffleAssert.reverts(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"),10, 0 ))
        await dex.DepositETH({value: web3.utils.toWei('1', 'ether')}, accounts[0]);
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 10, 0 ))


    })

    it("The user must have enough tokens deposited such that token balance >= sell order amount ", async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.passes( // assert the call pass dex.addToken 
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
        )
        await truffleAssert.reverts(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 100, 1 ))
        await link.approve(dex.address, 500 ); 
        await dex.deposit(100, web3.utils.fromUtf8("LINK")); 
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 100, 1 ))

        
    })

    it("The BUY order book should be ordered on price from highest to lowest starting at index 0 ", async() =>{
        let dex = await Dex.deployed();
    
        await dex.DepositETH({value: web3.utils.toWei('1', 'ether')}, accounts[0]);
        await dex.DepositETH({value: web3.utils.toWei('1', 'ether')}, accounts[1]);
        await dex.DepositETH({value: web3.utils.toWei('1', 'ether')}, accounts[2]);
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 10, 0 ))
        await truffleAssert.passes(dex.createLimitOrder(accounts[1],web3.utils.fromUtf8("LINK"), 100, 0 ))
        await truffleAssert.passes(dex.createLimitOrder(accounts[2],web3.utils.fromUtf8("LINK"), 7, 0 ))
        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][0][0].price, 100)
        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][0][1].price, 10)
        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][0][2].price, 7)
        
    })

    it("The SELL order book should be ordered on price from highest to lowest starting at index 0 ", async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await link.approve(dex.address, 500 ); 
        await dex.deposit(100, web3.utils.fromUtf8("LINK")); 
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 10, 1 ))
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 5, 1 ))
        await truffleAssert.passes(dex.createLimitOrder(accounts[0],web3.utils.fromUtf8("LINK"), 20, 1 ))

        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][1][0].price, 20)
        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][1][1].price, 5)
        assert.equal(orderBook[web3.utils.fromUtf8("LINK")][1][2].price, 10)
        
    })

})