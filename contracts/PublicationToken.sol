// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

import "./PublicationStore.sol";
import "./Utils.sol";

/**
 * @title PublicationToken
 * @notice A ERC721 representing a specific publication from a comic, e.g. a single page or an episode inside the comicbook
 */
contract PublicationToken is ERC721Enumerable, ERC721URIStorage, AccessControlEnumerable {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    PublicationStore private publicationStoreContract;

    /**
     * @notice Emitted when the 'tokenId' is minted and transfered to the 'owner' using URI 'publicationURI'
     */
    event Minted(uint256 indexed tokenId, address owner, string publicationURI);

    /**
     * @notice Initializes the contract by setting a `name`, `symbol` and `minter` for the token.
     */
    constructor (string memory name_, 
            string memory symbol_,
            address publicationStoreAddress
    ) ERC721(name_, symbol_) { 
        _setupRole(MINTER_ROLE, publicationStoreAddress);
        publicationStoreContract = PublicationStore(publicationStoreAddress);
    }

    /**
     * @notice Mint a token with the given URI
     * @param to The address to where the minted token will be transfered
     * @param publicationURI The URI to the publication metadata
     */
    function mint(
            address to, 
            string calldata publicationURI
    ) public virtual returns (uint256) {
        require (hasRole(MINTER_ROLE, _msgSender()), "ERROR_UNAUTHORIZED_MINTER");

        uint256 tokenId = totalSupply();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, publicationURI);

        emit Minted(tokenId, to, publicationURI);
        return tokenId;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControlEnumerable, ERC721Enumerable, ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(
        uint256 tokenId
    ) public view virtual override(ERC721URIStorage, ERC721) returns (string memory) {
        return ERC721URIStorage.tokenURI(tokenId);
    }

    /**
     * @dev Hook that is called before any token transfer. This includes minting
     * and burning.
     *
     * Calling conditions:
     *
     * - When `from` and `to` are both non-zero, ``from``'s `tokenId` will be
     * transferred to `to`.
     * - When `from` is zero, `tokenId` will be minted for `to`.
     * - When `to` is zero, ``from``'s `tokenId` will be burned.
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Enumerable, ERC721) {
        ERC721Enumerable._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @dev Destroys `tokenId`.
     * The approval is cleared when the token is burned.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     *
     * Emits a {Transfer} event.
     */
    function _burn(uint256 tokenId) internal virtual override(ERC721URIStorage, ERC721) {
        ERC721URIStorage._burn(tokenId);
    }

}