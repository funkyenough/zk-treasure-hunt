// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game} from "../contracts/Game.sol";
import {DeployGame} from "../script/DeployGame.s.sol";

contract GameTest is Test {
    address USER = makeAddr("user");
    Game game;
    function setUp() external {
        DeployGame deployGame = new DeployGame();
        game = deployGame.run();
    }

    // function testContractDeployed() public  {
    //     assert(game.owner == msg.sender);
    // }

    function testEntranceFeeIsSet() public view {
        assert(game.entranceFee() == 5e16);
    }
}
