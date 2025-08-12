contract SimpleBank {
    mapping(address => uint) balances;
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    function withdraw(uint amount) public {
        require(balances[msg.sender] >= amount);
        payable(msg.sender).transfer(amount); 
        balances[msg.sender] -= amount;
    }
}