# vue 钱包项目

future universe maximum endorse invite curious salon chimney omit clutch inside history

mobile orphan sadness science skin ensure base nasty clay shoulder satisfy asthma

session crunch current wing net proud wish edit post gold sport certain
session crunch current wing net proud wish edit post gold sport certain
# 概念
钱包
去中心化钱包 前端直接和区款连交互 不经过后端
区块链浏览器
  查看所有的账户信息 余额  和 交易记录

账户系统 
  钱包地址（区块地址）
  私钥
  助记词
  keystore

1. 通过助记词创建账户
2. 通过助记词 + 密码产生 keystore
3. 发起转账

## 项目创建与第三方包的安装

```bash
npm init vue@latest
```

```bash
npm install web3 bip39 ethereumjs-tx ethereumjs-util ethereumjs-wallet
```

> 注： ethereumjs-tx 使用1.3.7 版本

## 项目使用到的api

account

1. 通过助记词分层钱包创建账户

   ```javascript
   import { hdkey } from "ethereumjs-wallet";
   import * as bip39 from "bip39";
    let mnemonic = bip39.generateMnemonic();
   
     //1.将助记词转成seed
     let seed = await bip39.mnemonicToSeed(mnemonic);
     //3.通过hdkey将seed生成HD Wallet
     let hdWallet = hdkey.fromMasterSeed(seed);
     //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
     let keyPair = hdWallet.derivePath("m/44'/60'/0'/0/0");
     // 获取钱包对象
     let wallet = keyPair.getWallet();
     // 获取钱包地址
     let lowerCaseAddress = wallet.getAddressString();
     // 获取钱包校验地址
     let CheckSumAddress = wallet.getChecksumAddressString();
     // 获取私钥
     let prikey = wallet.getPrivateKey().toString("hex");
     console.log(prikey, data.pass1);
     let keystore = await wallet.toV3(data.pass1);
   ```

2. 通过助记词导入账户

   ```javascript
     //1.将助记词转成seed
     let seed = await bip39.mnemonicToSeed(data.mnemonic);
     //3.通过hdkey将seed生成HD Wallet
     let hdWallet = hdkey.fromMasterSeed(seed);
     //4.生成钱包中在m/44'/60'/0'/0/i路径的keypair
     let keyPair = hdWallet.derivePath("m/44'/60'/0'/0/0");
     // 获取钱包对象
     let wallet = keyPair.getWallet();
     // 获取钱包地址
     let lowerCaseAddress = wallet.getAddressString();
     // 获取钱包校验地址
     let CheckSumAddress = wallet.getChecksumAddressString();
     // 获取私钥
     let prikey = wallet.getPrivateKey().toString("hex");
     console.log(prikey, data.pass1);
     let keystore = await wallet.toV3(data.pass1);
   ```

3. 通过 密码 + keystore 获取私钥

   ```javascript
   import ethwallet from "ethereumjs-wallet";  
   let pass = prompt("请输入密码");
       let wallet;
       try {
         wallet = await ethwallet.fromV3(keystore, pass);
       } catch (error) {
         alert("密码错误");
         return false;
       }
       let key = wallet.getPrivateKey().toString("hex");
   ```

   

### eth

1. 创建web3实例对象

   ```javascript
   import Web3 from "web3";
   const geerliWS =
     "wss://goerli.infura.io/ws/v3/e4f789009c9245eeaad1d93ce9d059bb";
   this.web3 = new Web3(Web3.givenProvider || wsUrl);
   ```

2. 获取eth余额

   ```javascript
   this.web3.eth
           .getBalance(address)
           .then((balanceWei) => {
             const balance = Web3.utils.fromWei(balanceWei, "ether");
           })
   ```

3. eth单位之间的转换

   ```javascript
   // wei 转化为eth
   Web3.utils.fromWei(balanceWei, "ether")
   // eth 转化为wei
   Web3.utils.toWei(value);
   ```

4. 创建eth转账交易hash

   ```javascript
      // 创建交易hash
     async createTransationHx(key, fromAddress, toAddress, value) {
       const nonce = await this.web3.eth.getTransactionCount(fromAddress);
       var privateKey = new Buffer(key, "hex");
       // 获取预计转账gas费
       let gasPrice = await this.web3.eth.getGasPrice();
       // 转账金额以wei为单位
       let valueWei = Web3.utils.toWei(value);
       console.log(valueWei);
       // 转账的记录对象
       var rawTx = {
         from: fromAddress,
         nonce: nonce,
         gasPrice: gasPrice,
         to: toAddress,
         value: valueWei,
         data: "0x00", //转Token代币会用到的一个字段
       };
       //需要将交易的数据进行预估gas计算，然后将gas值设置到数据参数中
       let gas = await this.web3.eth.estimateGas(rawTx);
       rawTx.gas = gas;
       // 通过tx实现交易对象的加密操作
       var tx = new Tx(rawTx);
       tx.sign(privateKey);
       var serializedTx = tx.serialize();
       var transationHx = "0x" + serializedTx.toString("hex");
       return transationHx;
     }
   ```

5. 通过交易hash 发起转账

   ```javascript
   this.web3.eth
         .sendSignedTransaction(hx)
         .on("transactionHash", (txid) => {
           console.log("交易成功,请在区块链浏览器查看");
           console.log("交易id", txid);
           console.log(`https://goerli.etherscan.io/tx/${txid}`);
         })
         .on("receipt", (ret) => {
           cb && cb(ret);
           console.log("receipt", ret);
           const { transactionHash } = ret;
           this.createOrderData(transactionHash);
         })
         .on("latestBlockHash", (...arg) => {
           console.log("latestBlockHash", arg);
         })
         .on("error", (err) => {
           console.log("error:");
           console.log(err);
         });
   ```

   

### 智能合约

1. 通过智能合约文件 获取abi

   ```javascript
   import { abi } from "@/contract/HHC.json";
   ```

2. 在web3实例的基础上创建智能合约实例

```javascript
const hhc = new this.web3.eth.Contract(
  abi,
  "0x18dAaC8e2E422fDB5e26715eF1EcDca11F78eDE5"
);
```

3. 通过智能合约实例获取代币余额

```javascript
 let num = await hhc.methods.balanceOf(address).call();
Web3.utils.fromWei(num, "ether");
```

4. 智能合约交易hash 创建

```javascript
 async createCoinTransationHx(contractInstance, method, to, value) {
    let pass = prompt("请输入密码");
    let wallet;
    try {
      wallet = await ethwallet.fromV3(keystore, pass);
    } catch (error) {
      alert("密码错误");
      return false;
    }
    let key = wallet.getPrivateKey().toString("hex");
    const from = this.ownerAddress;
    // 当前地址交易次数
    const nonce = await this.instance.eth.getTransactionCount(from);
    var privateKey = new Buffer(key, "hex");
    // 获取预计转账gas费
    let gasPrice = await this.instance.eth.getGasPrice();
    // 转账金额以wei为单位
    let weiValue = await Web3.utils.toWei(value);
    // 转账的记录对象
    // 代币转账
    // this.HccCont = new this.web3.eth.Contract(
    //   abi,
    //   "0x18dAaC8e2E422fDB5e26715eF1EcDca11F78eDE5"
    // );
    const contractAbi = await contractInstance.methods[method](
      to,
      weiValue
    ).encodeABI();
    // console.log(contractAbi);
    // console.log(contractInstance._address);
    // return false;
    var rawTx = {
      from: this.ownerAddress,
      nonce: nonce,
      gasPrice: gasPrice,
      to: contractInstance._address, //eth 转账 to 目标地址 ，智能合约 to 智能合约地址
      value: 0, //eth 转账 数量
      data: contractAbi, //智能合约方法的abi编码
    };
    //需要将交易的数据进行预估gas计算，然后将gas值设置到数据参数中
    let gas = await this.instance.eth.estimateGas(rawTx);
    rawTx.gas = gas;
    // 通过tx实现交易对象的加密操作
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    var transationHx = "0x" + serializedTx.toString("hex");
    return transationHx;
  }
```



4. 智能合约代币转账

   ```javascript
   this.web3.eth
         .sendSignedTransaction(hx)
         .on("transactionHash", (txid) => {
           console.log("交易成功,请在区块链浏览器查看");
           console.log("交易id", txid);
           console.log(`https://goerli.etherscan.io/tx/${txid}`);
         })
         .on("receipt", (ret) => {
           cb && cb(ret);
           console.log("receipt", ret);
           const { transactionHash } = ret;
           this.createOrderData(transactionHash);
         })
         .on("latestBlockHash", (...arg) => {
           console.log("latestBlockHash", arg);
         })
         .on("error", (err) => {
           console.log("error:");
           console.log(err);
         });
   ```

   

## vue3中挂载全局对象

```javascript
const vm= createApp(App)
let c=()=>{
  console.log(1)
};
vm.config.globalProperties.$http =c;
vm.mount('#app');
// 使用
getCurrentInstance().proxy.$http
```
## 移动端屏幕适配 viewport
https://www.cnblogs.com/hongrun/p/16130707.html

##  测试助记词(可自己创建)

recycle donor auto cost call sea welcome dune august mercy zero barely
0xc2333cca333401c305bb29425588d737f3f52725
f43cf9835fdafcb8931040f0801e39952dd5c4f79191a9cdbb01e433df9a3966

## 项目基本功能梳理

### 1. 钱包初始化页面

1. 根据本地存储是否有钱包信息进入
2. 无钱包信息则进行创建或者恢复

![image-20221226111730650](https://gitee.com/fcjun/image/raw/master/img/202212261117677.png)

![image-20221226111743924](https://gitee.com/fcjun/image/raw/master/img/202212261117947.png)

![image-20221226111808926](https://gitee.com/fcjun/image/raw/master/img/202212261118957.png)

### 2.钱包首页余额

1. 创建或者恢复钱包后进入首页
2. 获取钱包地址eth余额显示
3. 获取钱包地址智能合约余额显示

![image-20221226111709972](https://gitee.com/fcjun/image/raw/master/img/202212261117470.png)

### 3. 钱包转账

1. 点击具体转账代币item 进入转账信息

2. 输入收款地址和金额进行转账
3. 注意 区块链环境是异步而且耗时较长可以通过区款连浏览器查看转账信息

![image-20221226112116447](https://gitee.com/fcjun/image/raw/master/img/202212261121482.png)

![image-20221226112442209](https://gitee.com/fcjun/image/raw/master/img/202212261124247.png)

![image-20221226112500843](https://gitee.com/fcjun/image/raw/master/img/202212261125865.png)

![image-20221226112650298](https://gitee.com/fcjun/image/raw/master/img/202212261126339.png)