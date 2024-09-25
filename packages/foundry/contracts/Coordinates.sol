pragma solidity ^0.8.20;

import "./Game.sol";

contract Coordinates {
    Game gameContract;

    struct Coordinate {
        uint256 coordinateId;
        address player;
        uint256 x;
        uint256 y;
    }

    event CoordinateCreated(
        uint256 coordinateId,
        address player,
        uint256 x,
        uint256 y
    );

    constructor(address _gameContractAddress) {
        gameContract = Game(_gameContractAddress);
    }

    // function createCoordinate(
    //     uint256 _gameId,
    //     uint256 _x,
    //     uint256 _y
    // ) external {
    //     // Create a new coordinate
    //     assert(gameContract.games[_gameId].isOver == false); // The game should be ongoing
    //     assert(gameContract.games[_gameId].startAt != 0);
    //     // TODO player should belong to a game
    //     uint256 coordinateId = nextCoordinateId;
    //     Coordinate memory newCoordinate = Coordinate(
    //         coordinateId,
    //         msg.sender,
    //         _x,
    //         _y
    //     );
    //     gameContract.games[_gameId].coordinates.push(newCoordinate);
    //     emit CoordinateCreated(coordinateId, msg.sender, _x, _y);
    //     nextCoordinateId++;
    // }

    // function getCoordinate(
    //     uint256 _gameId
    // ) public view returns (Coordinate[] memory) {
    //     // Get all coordinates of a game
    //     return gameContract.games[_gameId].coordinates;
    // }
}
