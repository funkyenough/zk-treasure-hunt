// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract zkForum {

    struct Forum {
        string name;
        string description;
        address creator;
        uint256 forumId;
    }

    Forum[] public forums;
    uint256 public nextForumId;

    function create_Forum(string name, string description) public {
        uint256 forumId = nextForumId;
        forums[forumId] = Forum(name, description, msg.sender, forumId);
        nextForumId++;
    }

    function get_Forum(uint256 forumId) public view returns (Forum[] memory) {
        return forums;
    }
}
