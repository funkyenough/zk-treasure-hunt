// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract zkTreasure {

    struct Coordinate {
        uint256 gameId;
        uint256 coordinateId;
        address owner;
        uint256 x;
        uint256 y;
    }

    struct Game {
        string name;
        string description;
        uint256 gameId;
    }

    mapping(uint256 => Coordinate) public coordinates;
    mapping(uint256 => Game) public games;
    mapping(uint256 => uint256[]) public gameCoordinates;

    uint256 public nextGameId;
    uint256 public nextCoordinateId;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    function createGame(string name, string description) external onlyOwner() {
        uint256 gameId = nextGameId;
        games[gameId] = Game(name, description, gameId);
        nextGameId++;
    }   

    function createCoordinate(uint256 gameId, uint256 x, uint256 y) public {
        uint256 coordinateId = nextCoordinateId;
        coordinates[coordinateId] = Coordinate(gameId, coordinateId, x, y);
        gameCoordinates[gameId].push(coordinateId);
        nextCoordinateId++;
    }

    function getCoordinate(uint256 gameId) public view returns (Coordinate[] memory) {
        return gameCoordinates[gameId];
    }
}
