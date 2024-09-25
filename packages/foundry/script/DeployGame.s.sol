//SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Game} from "../contracts/Game.sol";

contract DeployGame is Script {
    function run() external returns (Game) {
        vm.startBroadcast();
        Game game = new Game();
        vm.stopBroadcast();

        return game;
    }
}
