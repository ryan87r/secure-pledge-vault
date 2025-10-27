// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecurePledgeVault is SepoliaConfig {
    using FHE for *;
    
    struct Pledge {
        uint256 pledgeId;
        externalEuint32 targetAmount;
        externalEuint32 currentAmount;
        uint32 backerCount;
        bool isActive;
        bool isVerified;
        string title;
        string description;
        address pledger;
        uint256 startTime;
        uint256 endTime;
    }
    
    struct Backing {
        uint256 backingId;
        externalEuint32 amount;
        address backer;
        uint256 timestamp;
    }
    
    struct ImpactReport {
        uint256 reportId;
        uint32 beneficiariesReached;
        externalEuint32 fundsUtilized;
        bool isVerified;
        string reportHash;
        address reporter;
        uint256 timestamp;
    }
    
    mapping(uint256 => Pledge) public pledges;
    mapping(uint256 => Backing) public backings;
    mapping(uint256 => ImpactReport) public impactReports;
    mapping(address => externalEuint32) public userReputation;
    mapping(uint256 => uint256[]) public pledgeBackings; // pledgeId => backingIds
    
    uint256 public pledgeCounter;
    uint256 public backingCounter;
    uint256 public reportCounter;
    
    address public owner;
    address public verifier;
    
    event PledgeCreated(uint256 indexed pledgeId, address indexed pledger, string title);
    event PledgeBacked(uint256 indexed backingId, uint256 indexed pledgeId, address indexed backer, uint32 amount);
    event ImpactReported(uint256 indexed reportId, uint256 indexed pledgeId, address indexed reporter);
    event PledgeVerified(uint256 indexed pledgeId, bool isVerified);
    event ReputationUpdated(address indexed user, uint32 reputation);
    event FundsWithdrawn(uint256 indexed pledgeId, address indexed pledger, uint256 amount);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createPledge(
        string memory _title,
        string memory _description,
        externalEuint32 _targetAmount,
        uint256 _duration,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_title).length > 0, "Pledge title cannot be empty");
        require(_duration > 0, "Duration must be positive");
        
        uint256 pledgeId = pledgeCounter++;
        
        pledges[pledgeId] = Pledge({
            pledgeId: pledgeId,
            targetAmount: _targetAmount,
            currentAmount: externalEuint32(0), // Will be updated when backers contribute
            backerCount: 0,
            isActive: true,
            isVerified: false,
            title: _title,
            description: _description,
            pledger: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration
        });
        
        emit PledgeCreated(pledgeId, msg.sender, _title);
        return pledgeId;
    }
    
    function backPledge(
        uint256 pledgeId,
        externalEuint32 amount,
        bytes calldata inputProof
    ) public payable returns (uint256) {
        require(pledges[pledgeId].pledger != address(0), "Pledge does not exist");
        require(pledges[pledgeId].isActive, "Pledge is not active");
        require(block.timestamp <= pledges[pledgeId].endTime, "Pledge has ended");
        require(msg.value > 0, "Must send ETH to back pledge");
        
        uint256 backingId = backingCounter++;
        
        backings[backingId] = Backing({
            backingId: backingId,
            amount: amount,
            backer: msg.sender,
            timestamp: block.timestamp
        });
        
        // Track backing for this pledge
        pledgeBackings[pledgeId].push(backingId);
        
        // Update pledge backer count (unencrypted)
        pledges[pledgeId].backerCount += 1;
        
        emit PledgeBacked(backingId, pledgeId, msg.sender, 0); // Amount will be decrypted off-chain
        return backingId;
    }
    
    function submitImpactReport(
        uint256 pledgeId,
        uint32 beneficiariesReached,
        externalEuint32 fundsUtilized,
        string memory reportHash,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(pledges[pledgeId].pledger == msg.sender, "Only pledger can submit report");
        require(pledges[pledgeId].isActive, "Pledge must be active");
        require(bytes(reportHash).length > 0, "Report hash cannot be empty");
        
        uint256 reportId = reportCounter++;
        
        impactReports[reportId] = ImpactReport({
            reportId: reportId,
            beneficiariesReached: beneficiariesReached,
            fundsUtilized: fundsUtilized,
            isVerified: false,
            reportHash: reportHash,
            reporter: msg.sender,
            timestamp: block.timestamp
        });
        
        emit ImpactReported(reportId, pledgeId, msg.sender);
        return reportId;
    }
    
    function verifyPledge(uint256 pledgeId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify pledges");
        require(pledges[pledgeId].pledger != address(0), "Pledge does not exist");
        
        pledges[pledgeId].isVerified = isVerified;
        emit PledgeVerified(pledgeId, isVerified);
    }
    
    function updateReputation(address user, externalEuint32 reputation) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(user != address(0), "Invalid user address");
        
        userReputation[user] = reputation;
        emit ReputationUpdated(user, 0); // FHE.decrypt(reputation) - will be decrypted off-chain
    }
    
    function getPledgeInfo(uint256 pledgeId) public view returns (
        string memory title,
        string memory description,
        externalEuint32 targetAmount,
        externalEuint32 currentAmount,
        uint32 backerCount,
        bool isActive,
        bool isVerified,
        address pledger,
        uint256 startTime,
        uint256 endTime
    ) {
        Pledge storage pledge = pledges[pledgeId];
        return (
            pledge.title,
            pledge.description,
            pledge.targetAmount,
            pledge.currentAmount,
            pledge.backerCount,
            pledge.isActive,
            pledge.isVerified,
            pledge.pledger,
            pledge.startTime,
            pledge.endTime
        );
    }
    
    function getBackingInfo(uint256 backingId) public view returns (
        externalEuint32 amount,
        address backer,
        uint256 timestamp
    ) {
        Backing storage backing = backings[backingId];
        return (
            backing.amount,
            backing.backer,
            backing.timestamp
        );
    }
    
    function getImpactReportInfo(uint256 reportId) public view returns (
        uint32 beneficiariesReached,
        externalEuint32 fundsUtilized,
        bool isVerified,
        string memory reportHash,
        address reporter,
        uint256 timestamp
    ) {
        ImpactReport storage report = impactReports[reportId];
        return (
            report.beneficiariesReached,
            report.fundsUtilized,
            report.isVerified,
            report.reportHash,
            report.reporter,
            report.timestamp
        );
    }
    
    function getUserReputation(address user) public view returns (externalEuint32) {
        return userReputation[user];
    }
    
    function getPledgeBackings(uint256 pledgeId) public view returns (uint256[] memory) {
        return pledgeBackings[pledgeId];
    }
    
    function withdrawFunds(uint256 pledgeId) public {
        require(pledges[pledgeId].pledger == msg.sender, "Only pledger can withdraw");
        require(pledges[pledgeId].isVerified, "Pledge must be verified");
        require(block.timestamp > pledges[pledgeId].endTime, "Pledge must be ended");
        require(pledges[pledgeId].isActive, "Pledge must be active");
        
        // Calculate total ETH sent for this pledge
        uint256 totalAmount = 0;
        uint256[] memory backingIds = pledgeBackings[pledgeId];
        
        for (uint256 i = 0; i < backingIds.length; i++) {
            // In a real implementation, you would need to track ETH amounts separately
            // For now, we'll use a simplified approach
            totalAmount += 1 ether; // Placeholder amount
        }
        
        // Deactivate pledge
        pledges[pledgeId].isActive = false;
        
        // Transfer funds to pledger
        if (totalAmount > 0) {
            payable(msg.sender).transfer(totalAmount);
            emit FundsWithdrawn(pledgeId, msg.sender, totalAmount);
        }
    }
    
    function emergencyWithdraw() public {
        require(msg.sender == owner, "Only owner can emergency withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    function updateVerifier(address _verifier) public {
        require(msg.sender == owner, "Only owner can update verifier");
        require(_verifier != address(0), "Invalid verifier address");
        verifier = _verifier;
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
    
    // Function to get contract balance
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
