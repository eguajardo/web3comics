// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Context.sol";

/**
 * @title Users
 * @notice Contract keeping track of the users from the app
 */
contract Users is Context {

  /**
   * @dev Mapping of users DIDs to address
   */
  mapping(string => address) private _didToAddress;

  /**
   * @dev Array containing all users DIDs
   */
  string[] private _allDIDs;

  /**
   * @return a list of all users DIDs
   */
  function dids() external view returns (string[] memory) {
    return _allDIDs;
  }

  /**
   * @return the address corresponding to a given did
   */
  function didAddress(string calldata did) public view returns (address) {
    return _didToAddress[did];
  }

  /**
   * @notice register a DID
   */
  function registerDid(string calldata did) external {
    require (didAddress(did) == address(0), "ERROR_DID_ALREADY_REGISTERED");

    _didToAddress[did] = _msgSender();
    _allDIDs.push(did);
  }
}