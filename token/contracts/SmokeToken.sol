//  contracts/SmokeToken.sol
//  SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title SmokeToken for a private discord group.
/// @author adamdire
/// @notice A token to use between friends as a meme / form of validation of our ranking.
contract SmokeToken is ERC20, AccessControl {
    using SafeMath for uint256;

    // Roles
    bytes32 public constant ORACLE = keccak256("ORACLE");

    //  Variables
    uint256 private _mintAmount = 1092 * 10**decimals();
    mapping(address => bool) private _hasGeneratedSmoke;
    address[] private _members;

    //  Events
    event Wooed(address address_, uint256 amount);
    event NewMember(address address_);
    event WooWednesday(uint256 timestamp, uint256 individualAmount);

    constructor() ERC20("SmokeToken", "SMKE") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function generateSmoke() external {
        require(
            !_hasGeneratedSmoke[msg.sender],
            "Error: This address has already generated smoke."
        );
        _mint(msg.sender, _mintAmount);
        _members.push(msg.sender);
        _hasGeneratedSmoke[msg.sender] = true;
        emit NewMember(msg.sender);
    }

    function woo(uint256 amount) external {
        require(
            balanceOf(msg.sender) >= amount,
            "ERC20: Transfer amount exceeds balance"
        );
        _burn(msg.sender, amount);

        uint256 individualAmount;
        if (_members.length >= 1) {
            individualAmount = amount.div(_members.length);
        } else {
            individualAmount = amount;
        }

        for (uint256 i = 0; i < _members.length; i = i.add(1)) {
            _mint(_members[i], individualAmount);
        }

        emit Wooed(msg.sender, amount);
    }

    function wooWednesday() external {
        require(
            hasRole(ORACLE, msg.sender),
            "Error: Only an oracle can call a woo wednesday."
        );

        uint256 individualAmount;
        if (_members.length >= 1) {
            individualAmount = _mintAmount.div(_members.length);
        } else {
            individualAmount = _mintAmount;
        }

        for (uint256 i = 0; i < _members.length; i = i.add(1)) {
            _mint(_members[i], individualAmount);
        }

        emit WooWednesday(block.timestamp, individualAmount);
    }

    function setMintAmount(uint256 mintAmount_) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Error: Only the owner can set the mint amount."
        );
        _mintAmount = mintAmount_;
    }

    function getMintAmount() external view returns (uint256) {
        return _mintAmount;
    }

    function setOracle(address address_) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Error: Only an admin can set a role."
        );

        grantRole(ORACLE, address_);
    }
}
