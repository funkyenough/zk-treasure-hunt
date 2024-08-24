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

    Game[] public games;
    mapping(address => Coordinate[]) public coordinates;

    uint256 public nextGameId;
    uint256 public nextCoordinateId;
    address public owner;
    uint256 public entranceFee;

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

    function createGame(string memory _name, string memory _description, uint256 _duration) external onlyOwner () {
        // Create a new game
        uint256 gameId = nextGameId;
        Game memory newGame = Game(_name, _description, 0, _duration, new address[](0), new Coordinate[](0), false, address(0), 0, 0 ether);
        games[gameId] = newGame;
        nextGameId++;
    }   

    function startGame(uint256 _gameId) external onlyOwner () { // Start the game
        assert(games[_gameId].isOver == false); // The game should not have started
        assert(games[_gameId].startAt == 0);
        games[_gameId].startAt = block.timestamp;
    }

    function finishGame(uint256 _gameId) external { // Finish the game
        assert(games[_gameId].isOver == false);
        assert(games[_gameId].startAt + games[_gameId].duration <= block.timestamp);
        games[_gameId].isOver = true;
    }

    function createCoordinate(uint256 _gameId, uint256 _x, uint256 _y) external  { // Create a new coordinate  
        assert(games[_gameId].isOver == false); // The game should be ongoing
        assert(games[_gameId].startAt != 0);
        uint256 coordinateId = nextCoordinateId;
        Coordinate memory newCoordinate = Coordinate(coordinateId, _x, _y);
        games[_gameId].coordinates.push(newCoordinate);
        coordinates[msg.sender].push(newCoordinate);
        nextCoordinateId++;
    }

    function getCoordinate(uint256 _gameId) public view returns (Coordinate[] memory) { // Get all coordinates of a game
        return games[_gameId].coordinates;
    }

    function getGame(uint256 _gameId) public view returns (Game memory) { // Get a game
        return games[_gameId];
    }
 
    function deposit(uint _gameId) external payable { // Deposit the entrance fee
        require(msg.value >= entranceFee, "The amount shoud be more than entranceFee."); 
        games[_gameId].players.push(msg.sender);
        games[_gameId].totalDeposit += msg.value;
    }

    function setWinner(uint256 _gameId) external onlyOwner () { // Set the winner
        // Here we compute the winner
        assert(games[_gameId].isOver == true); // The game should be over
        //fraudProofCheck();
        payment(_gameId);
    }

    function payment(uint256 _gameId) public onlyOwner payable { // Send rewards to the winner
        (bool success, ) = games[_gameId].closestPlayer.call{value: games[_gameId].totalDeposit}("");
        require(success, "Failed to send Rewards");
    }

    function fraudProofCheck(uint256 _gameId) external { // Check if a player is cheating
        // Here we check if the player is the closest to the treasure
        uint256 x = games[_gameId].coordinates[games[_gameId].coordinates.length - 1].x;
        uint256 y = games[_gameId].coordinates[games[_gameId].coordinates.length - 1].y;
        uint256 distance = games[_gameId].closestDistance;
        if(x^2+y^2 < distance^2) {
            games[_gameId].closestPlayer = msg.sender;
            games[_gameId].closestDistance = x^2+y^2;
        }
    }
}