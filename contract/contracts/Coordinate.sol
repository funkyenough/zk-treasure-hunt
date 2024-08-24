// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract zkTreasure {

    struct Coordinate {
        uint256 coordinateId;
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
    }

    mapping(uint256 => Game[]) public games;
    mapping(address => Coordinate[]) public coordinates;

    uint256 public nextGameId;
    uint256 public nextCoordinateId;
    address public immutable owner;
    uint256 public entranceFee;

    constructor() {
        owner = msg.sender;
        entranceFee = 0.05 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier checkGameId() {
        require(games[_gameId].name != "", "Game does not exist");
        _;
    }

    function changeOwner(address _newOwner) external onlyOwner { // Change the owner
        owner = _newOwner;
    }

    function changeEntranceFee(uint256 _newFee) external onlyOwner { // Change the entrance fee
        for (uint i = 0; i < games.length; i++) { // Check if there are still players in the game
            require(games[i].totalDeposit == 0, "There are still players in the game");
        }
        entranceFee = _newFee; // If not, change the entrance fee
    }

    function createGame(string _name, string _description, uint256 _duration) external onlyOnwer () {
        // Create a new game
        uint256 gameId = nextGameId;
        games[gameId] = Game(_name, _description, gameId);
        games[gameId].duration = _duration;
        nextGameId++;
    }   

    function startGame(uint256 _gameId) external onlyOwner checkGameId () { // Start the game
        assert(games[_gameId].isOver == false); // The game should not have started
        assert(games[_gameId].startAt == 0);
        games[_gameId].startAt = block.timestamp;
    }

    function finishGame(uint256 _gameId) external checkGameId () { // Finish the game
        assert(games[_gameId].isOver == false);
        assert(games[_gameId].startAt + games[_gameId].duration <= block.timestamp);
        games[_gameId].isOver = true;
    }

    function createCoordinate(uint256 _gameId, uint256 _x, uint256 _y) external checkGameId { // Create a new coordinate  
        assert(games[_gameId].isOver == false); // The game should be ongoing
        assert(games[_gameId].startAt != 0);
        uint256 coordinateId = nextCoordinateId;
        Coordinate memory newCoordinate = Coordinate(coordinateId, _x, _y);
        games[_gameId].coordinates.push(newCoordinate);
        coordinates[msg.sender].push(newCoordinate);
        nextCoordinateId++;
    }

    function getCoordinate(uint256 _gameId) public view checkGameId returns (Coordinate[] memory) { // Get all coordinates of a game
        return gameCoordinates[_gameId];
    }

    function getGame(uint256 _gameId) public view checkGameId returns (Game memory) { // Get a game
        return games[_gameId];
    }
 
    function deposit(uint _gameId) external checkGameId payable { // Deposit the entrance fee
        require(msg.value >= entranceFee, "The amount shoud be more than entranceFee."); 
        games[_gameId].players.push(msg.sender);
        games[_gameId].totalDeposit += msg.value;
    }

    function setWinner(uint256 _gameId) external onlyOwner checkGameId() { // Set the winner
        // Here we compute the winner
        assert(games[_gameId].isOver == true); // The game should be over
        games[_gameId].winner = _winner;
    }

    function payment(uint256 _gameId) public onlyOwner payable { // Send rewards to the winner
        (bool sent, bytes memory data) = _to.call{value: game[_gameId].totalDeposit}("");
        require(sent, "Failed to send Rewards");
    }

    function fraudProofCheck(address _player, uint256 _gameId) external { // Check if a player is cheating
        // Here we check if the player is the closest to the treasure
        uint256 x = games[_gameId].coordinates[games[_gameId].coordinates.length - 1].x;
        uint256 y = games[_gameId].coordinates[games[_gameId].coordinates.length - 1].y;
        if 
    }