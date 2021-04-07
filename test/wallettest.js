const Dex = artifacts.require("Dex");
const Link = artifacts.require("Link");
const truffleAssert = require('truffle-assertions'); // we need to run npm install truffle-assertions 

contract("Dex", accounts =>{// for test it looks like Mocha 
    it("should only be possible for owner to add tokens", async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.passes( // assert the call pass dex.addToken 
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[0]})
        )
        await truffleAssert.reverts( //  this is for fails thats why passes the test
            dex.addToken(web3.utils.fromUtf8("LINK"), link.address, {from: accounts[1]})
        )
    })

    it("should handle deposits correctly ", async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await link.approve(dex.address, 500 ); 
        await dex.deposit(100, web3.utils.fromUtf8("LINK")); 
        let balance = await dex.balances(accounts[0], web3.utils.fromUtf8("LINK"))
        assert.equal(balance.toNumber(), 100) // normal assert mocha
    })

    it("should handle faulty withdraws correctly" , async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.reverts(dex.withdraw(500, web3.utils.fromUtf8("LINK")))
    })
    it("should handle correct withdraws correctly" , async() =>{
        let dex = await Dex.deployed();
        let link = await Link.deployed();
        await truffleAssert.passes(dex.withdraw(100, web3.utils.fromUtf8("LINK")))
    })

})