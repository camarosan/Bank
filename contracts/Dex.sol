// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "./Wallet.sol";

contract Dex is Wallet {

    using SafeMath for uint256;
    enum Side {
        BUY,
        SELL 
    }

    struct Order {
        uint id;
        address trader;
        Side side;
        bytes32 ticker;
        uint amount;
        uint price;
    }

    uint public nextOrderId; 

    mapping(bytes32 => mapping(uint => Order[])) public orderBook;
    function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory ){
        return orderBook[ticker][uint(side)];
    }

    function depositEth() public  payable {
        balances[msg.sender]["ETH"] = balances[msg.sender]["ETH"].add(msg.value);
    }

    function createLimitOrder(Side side, bytes32 ticker, uint amount, uint price)  public  {
        if(side == Side.BUY) {
            require(balances[msg.sender]["ETH"] >= amount.mul(price));
        }
        else if(side == Side.SELL) {
            require(balances[msg.sender][ticker] >= amount.mul(price));
        } 
        
        Order[] storage orders = orderBook[ticker][uint(side)];
        orders.push(
            Order(nextOrderId, msg.sender, side, ticker, amount, price)
        );
        
        
        //Bubble sort 
        uint i = orders.length > 0 ? orders.length - 1 : 0;
        
            if (side == Side.BUY){
                while (i > 0){
                    if(orders[i-1].price > orders[i].price){
                        break;
                    }
                    Order memory orderToMove = orders[i-1];
                    orders[i-1] = orders[i]; 
                    orders[i] = orderToMove; 
                    i--;
                }
                
            }
            else if (side == Side.SELL){
                while (i > 0){
                    if(orders[i-1].price < orders[i].price){
                        break;
                    }
                    Order memory orderToMove = orders[i-1];
                    orders[i-1] = orders[i]; 
                    orders[i] = orderToMove; 
                    i--;
                }
               
            } 
            nextOrderId++;
    
    }
     
}