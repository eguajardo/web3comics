// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Context.sol";

import "./Utils.sol";
import "./PublicationToken.sol";

/**
 * @title PublicationStore
 * @notice Contract handling publications purchases and data
 */
contract PublicationStore is Context {

    uint8 public constant MINIMUM_TOKEN_PRICE = 1;

    PublicationToken internal tokenContract;

    /**
     * @notice Struct holding the publication data
     */
    struct PublicationData {
        string uri;
        uint256 price;
        address author;
    }

    /**
     * @dev Mapping from ceramic stream ID holding comics publications to a 
     * mapping of index to publication metadata URI
     */
    mapping(string => mapping(uint256 => PublicationData)) private _publicationsData;

     /**
     * @notice Emitted when the 'author' creates the publication store for stream with ID 'streamId' and 'index'
     */
    event PublicationStoreCreated(address indexed author, string indexed streamId, uint256 indexed index);

    /**
     * @notice Emitted when a publication with 'streamId' and 'index' is purchased and generated the 'tokenId'
     */
    event PublicationPurchased(uint256 indexed tokenId, string indexed streamId, uint256 indexed index);

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` for the token.
     */
    constructor (
        string memory name,
        string memory symbol
    ) {
        tokenContract = new PublicationToken(name, symbol, address(this));
    }

    /**
     * @notice Creates a new publication store
     * @param streamId The ceramic stream ID holding the comic publications
     * @param index The index of this publication in the comic
     * @param uri The URI to the publication metadata
     * @param price cost to buy the publication in the store
     */
    function createPublicationStore(
        string calldata streamId, 
        uint256 index, 
        string calldata uri, 
        uint256 price
    ) external {
        require (Utils.isNotEmptyString(streamId), "ERROR_EMPTY_STREAM_ID");
        require (Utils.isNotEmptyString(uri), "ERROR_EMPTY_URI");
        require (price >= MINIMUM_TOKEN_PRICE, "ERROR_PRICE_UNDER_LIMIT");

        PublicationData storage publication = _publicationsData[streamId][index];
        publication.uri = uri;
        publication.price = price;
        publication.author = _msgSender();

        emit PublicationStoreCreated(_msgSender(), streamId, index);
    }

    /**
     * @notice Buys a publication token (NFT) represented by the streamId and index combination
     * @param streamId The ceramic stream ID holding the comic publications
     * @param index The index of this publication in the comic
     */
    function buyToken(
        string calldata streamId, 
        uint256 index
    ) payable public returns (uint256) {
        require(exist(streamId, index), "ERROR_INVALID_STREAM_OR_INDEX");
        PublicationData storage publication = _publicationsData[streamId][index];
        require(msg.value == publication.price, "ERROR_INVALID_AMOUNT");

        uint256 tokenId = tokenContract.mint(_msgSender(), publication.uri);
        emit PublicationPurchased(tokenId, streamId, index);
        return tokenId;
    }

    /**
     * @notice PublicationStore URI pointing to the publication metadata.
     * @param streamId The ceramic stream ID holding the comic publications
     * @param index The index of the publication in the comic
     */
    function publicationURI(string calldata streamId, uint256 index) external view returns (string memory) {
        require(exist(streamId, index), "ERROR_INVALID_STREAM_OR_INDEX");
        return _publicationsData[streamId][index].uri;
    }

    /**
     * @return true if a store exist with the combination of streamId and index
     * @param streamId The ceramic stream ID holding the comic publications
     * @param index The index of this publication in the comic
     */
    function exist(string calldata streamId, uint256 index) public view returns (bool) {
        return Utils.isNotEmptyString(_publicationsData[streamId][index].uri);
    }

    /**
     * @notice Gets the address of the used ERC721 for minting
     * @return address of the PublicationToken contract
     */
    function tokenContractAddress() external view returns(address) {
        return address(tokenContract);
    }

}