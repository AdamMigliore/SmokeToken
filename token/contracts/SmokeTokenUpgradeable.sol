//  contracts/SmokeToken.sol
//  SPDX-License-Identifier: MIT
pragma solidity >=0.8.7;

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title SmokeToken for a private discord group.
/// @author adamdire
/// @notice A token to use between friends as a meme / form of validation of our ranking.
contract SmokeTokenUpgradeable is
    Initializable,
    ERC20Upgradeable,
    AccessControlUpgradeable
{
    using SafeMath for uint256;

    // Roles
    bytes32 public constant ORACLE = keccak256("ORACLE");

    //  Variables
    uint256 private _mintAmount;
    uint256 private _distributionAmount;
    mapping(address => bool) private _hasGeneratedSmoke;
    address[] private _members;

    //  Events
    event Wooed(address address_, uint256 amount);
    event NewMember(address address_);
    event WooWednesday(uint256 timestamp, uint256 individualAmount);

    function initialize() public initializer {
        __ERC20_init("SmokeToken", "SMKE");
        _mintAmount = 1092 * 10**decimals();
        _distributionAmount = 1092 * 10**decimals();
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
            individualAmount = _distributionAmount.div(_members.length);
        } else {
            individualAmount = _distributionAmount;
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

    function setDistributionAmount(uint256 distributionAmount_) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Error: Only the owner can set the distribution amount."
        );
        _distributionAmount = distributionAmount_;
    }

    function getDistributionAmount() external view returns (uint256) {
        return _distributionAmount;
    }

    function setOracle(address address_) external {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Error: Only an admin can set a role."
        );

        grantRole(ORACLE, address_);
    }

    function hasGeneratedSmoke(address _address) external view returns (bool) {
        return _hasGeneratedSmoke[_address];
    }

    function membersCount() external view returns (uint256) {
        return _members.length;
    }
}
