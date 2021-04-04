// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 < 0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable {
    using SafeMath for uint256;
    struct Token  {
        bytes32 ticker;
        address tokenAddress;
    }
    mapping(bytes32 => Token ) public tokenMapping;
    bytes32[] public tokenList;
    mapping (address=> mapping (bytes32 => uint256)) public balances; 

    modifier tokenExist(bytes32 ticker) { // to check ticker is not in the mapping is the same that is not address(0) 
        require(tokenMapping [ticker].tokenAddress != address(0));
        _;
    }

    function addToken(bytes32 ticker, address tokenAddress) onlyOwner external {
        tokenMapping[ticker] = Token(ticker,tokenAddress);
        tokenList.push(ticker);
    }

    function deposit(uint256 amount, bytes32 ticker) tokenExist(ticker)external {
        require(tokenMapping [ticker].tokenAddress != address(0));
        IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender,address(this), amount);
        balances[msg.sender][ticker] = balances[msg.sender][ticker].add(amount);

    }

    function withdraw(uint256 amount, bytes32 ticker) tokenExist(ticker) external {
         
        require(balances[msg.sender][ticker] >= amount, "Balance not sufficient");
        balances[msg.sender][ticker] = balances[msg.sender][ticker].sub(amount);
        IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);

    }
}