// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TickifyTicket is ERC721, Ownable {

    uint256 private _nextTokenId;

    mapping(uint256 => uint256) public tokenEvent;

    mapping(uint256 => bool) public checkedIn;

    constructor(address initialOwner)
        ERC721("Tickify Ticket", "TIX")
        Ownable(initialOwner)
    {}

    function mintTicket(
        address to,
        uint256 eventId
    ) public onlyOwner returns (uint256) {

        uint256 tokenId = ++_nextTokenId;

        _safeMint(to, tokenId);

        tokenEvent[tokenId] = eventId;

        checkedIn[tokenId] = false;

        return tokenId;
    }

    function checkIn(uint256 tokenId)
        public
        onlyOwner
    {
        require(ownerOf(tokenId) != address(0), "Ticket not found");
        require(!checkedIn[tokenId], "Already checked in");

        checkedIn[tokenId] = true;
    }

    function isCheckedIn(uint256 tokenId)
        public
        view
        returns(bool)
    {
        return checkedIn[tokenId];
    }

    function getEventId(uint256 tokenId)
        public
        view
        returns(uint256)
    {
        return tokenEvent[tokenId];
    }
}