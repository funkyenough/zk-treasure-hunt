// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./PoseidonT3.sol";

contract zkTreasure {

    struct Coordinate {
        uint256 coordinateId;
        address player;
        uint256 x;
        uint256 y;
    }

    struct Game {
        string name;
        string description;
        uint256 startAt;
        uint256 duration;
        address [] players;
        Coordinate[] coordinates;
        bool isOver;
        address closestPlayer;
        uint256 closestDistance;
        uint256 totalDeposit;
        uint256 treasureHash;
        Coordinate treasureCoordinate;
        bool treasureCoordinateVerified;
    }

    Game[] public games;

    uint256 public nextGameId;
    uint256 public nextCoordinateId;
    address public owner;
    uint256 public entranceFee;

    event CoordinateCreated(uint256 coordinateId, address player, uint256 x, uint256 y);

    constructor() {
        owner = msg.sender;
        entranceFee = 0.05 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    // modifier checkGameId(uint256 _gameId) {
    //     require(games[_gameId].length > 0, "Game does not exist");
    //     _;
    // }

    function changeOwner(address _newOwner) external onlyOwner { // Change the owner
        owner = _newOwner;
    }

    function changeEntranceFee(uint256 _newFee) external onlyOwner { // Change the entrance fee
        for (uint i = 0; i < games.length; i++) { // Check if there are still players in the game
            require(games[i].totalDeposit == 0, "There are still players in the game");
        }
        entranceFee = _newFee; // If not, change the entrance fee
    }

    function createGame(string memory _name, string memory _description, uint256 _duration, uint256 _treasureHash) external onlyOwner {
        // Create a new game
        uint256 gameId = nextGameId;
        games.push(); // This creates a new empty Game struct in storage
        Game storage newGame = games[gameId];

        newGame.name = _name;
        newGame.description = _description;
        newGame.startAt = block.timestamp;
        newGame.duration = _duration;
        newGame.isOver = false;
        newGame.closestPlayer = address(0);
        newGame.closestDistance = type(uint256).max;
        newGame.totalDeposit = 0;
        newGame.treasureHash = _treasureHash;
        newGame.treasureCoordinateVerified = false;

        // Initialize the treasureCoordinate
        newGame.treasureCoordinate = Coordinate({
            coordinateId: 0,
            player: address(0),
            x: 0,
            y: 0
        });

        nextGameId++;
    }

    function getGame(uint256 _gameId) public view returns (Game memory) { // Get a game
        return games[_gameId];
    }

    function finishGame(uint256 _gameId, Coordinate memory _treasureCoordinate) onlyOwner external { // Finish the game
        assert(games[_gameId].isOver == false);
        assert(games[_gameId].startAt + games[_gameId].duration <= block.timestamp);
        games[_gameId].treasureCoordinate = _treasureCoordinate;
        games[_gameId].isOver = true;
    }

    function createCoordinate(uint256 _gameId, uint256 _x, uint256 _y) external  { // Create a new coordinate
        assert(games[_gameId].isOver == false); // The game should be ongoing
        assert(games[_gameId].startAt != 0);
        // TODO player should belong to a game
        uint256 coordinateId = nextCoordinateId;
        Coordinate memory newCoordinate = Coordinate(coordinateId, msg.sender, _x, _y);
        games[_gameId].coordinates.push(newCoordinate);
        emit CoordinateCreated(coordinateId, msg.sender, _x, _y);
        nextCoordinateId++;
    }

    function getCoordinate(uint256 _gameId) public view returns (Coordinate[] memory) { // Get all coordinates of a game
        return games[_gameId].coordinates;
    }

    function verifyTreasureCoordinate(uint256 _gameId, Coordinate memory _treasureCoordinate) external { // Verify the treasure coordinate
        require(games[_gameId].isOver == true, "The game should be over");
        require(games[_gameId].treasureCoordinateVerified == false, "The treasure coordinate is already verified");
        require(games[_gameId].treasureHash == PoseidonT3.hash([_treasureCoordinate.x, _treasureCoordinate.y]), "The treasure coordinate is wrong");
        games[_gameId].treasureCoordinateVerified = true;
    }

    function deposit(uint _gameId) external payable { // Deposit the entrance fee
        require(msg.value >= entranceFee, "The amount shoud be more than entranceFee.");
        games[_gameId].players.push(msg.sender);
        games[_gameId].totalDeposit += msg.value;
    }

    function withdraw(uint256 _gameId) public onlyOwner payable { // Send rewards to the winner
        (bool success, ) = games[_gameId].closestPlayer.call{value: games[_gameId].totalDeposit}("");
        require(success, "Failed to send Rewards");
    }

    function sqrt(uint x) internal pure returns (uint y) {
        uint z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }

    function fraudProofCheck(uint256 _gameId, uint256 coordinateId) external { // Check if a player is cheating
        // Here we check if the player is the closest to the treasure
        require(games[_gameId].treasureCoordinateVerified == true, "The treasure coordinate is not verified");

        uint256 inputX = games[_gameId].coordinates[coordinateId].x;
        uint256 inputY = games[_gameId].coordinates[coordinateId].y;
        uint256 treasureX = games[_gameId].treasureCoordinate.x;
        uint256 treasureY = games[_gameId].treasureCoordinate.y;
        uint256 distance = sqrt((inputX - treasureX) ** 2 + (inputY - treasureY) ** 2);
        if(distance < distance) {
            games[_gameId].closestPlayer = msg.sender;
            games[_gameId].closestDistance = distance;
        }
    }

    function setWinner(uint256 _gameId) external onlyOwner () { // Set the winner
        // Here we compute the winner
        assert(games[_gameId].isOver == true); // The game should be over
        //fraudProofCheck();
        withdraw(_gameId);
    }
}