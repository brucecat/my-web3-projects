const Contracts = artifacts.require("StudentStorage.sol");
// const Contracts = actifacts.require("StudentStorage.sol");

module.exports = function (deployer) {
  // 0x467E434bDe95A5f1f935422763d92BD31f6f8328
  deployer.deploy(Contracts);
  //   deployer.deploy(Contracts);
};
