### 编译

1. truffle complie

### 部署

1. 写脚本
2. truffle migrate --reset


### 测试

1. truffle console

```javascript
const r = await StudentStorage.deployed();
```

2. truffle.exec ./test/\*.js


### ganache 

```bash
ganache -d
-d 保持账号不变 eth初始化
```

```bash
Available Accounts
==================
(0) 0xDD11e9e359c3aD841e9f9cfce7Da43D0dEeAb17b (1000 ETH)
(1) 0xa1A21c6086f0dfbBF0f4dEF3482A4483e64F0874 (1000 ETH)
(2) 0x0067974FD22C604B93da3fC0D47239D5dF957f47 (1000 ETH)
(3) 0xb594223De821E3DfCF858a254452aA6868205977 (1000 ETH)
(4) 0x3e63312e176F7c88a5DF36CCb89370D41E06F08A (1000 ETH)
(5) 0x5607d9A21e2e0A05c82405e6E16A0dd690fA8845 (1000 ETH)
(6) 0x0479140Bb75F01B3DE46f24Bbf1Df4bf17BA2092 (1000 ETH)
(7) 0x71abcaDB12ABC4977375e202711991fEAc97B3D9 (1000 ETH)
(8) 0xDb4DcA30ae4f1e1546A4e2FB64F4aD9b1a3C50ac (1000 ETH)
(9) 0xdA2c3a42C134Ec3dc010ca70E1b69a961B7685b8 (1000 ETH)

Private Keys
==================
(0) 0x53e16a6f524b7ed62ca8226a44842622d5ca71b33279ed5de6fb6af5b9718dcf
(1) 0x60a7a5c289d4d3723b01a8a59fc91e4d9e5d6f661f7dca44ff436e7d8801de8c
(2) 0x5099d484782cccea4029e2c2ba3152114ff2e75cf5dfcd3bce594d5bb1768036
(3) 0x1de48c5bf5647df3aa0b6d11dd3bb7ac899e46a08698b0f3c94bac29dcd788d9
(4) 0x1bf2f76afbfac61e41bd4161ae889c6d9f3a9a74fb17be324f1e73164b8e9144
(5) 0xbd60995df475d1ffcb26f78bb126fcb25667349f3f94cd7a802b67864c553b3f
(6) 0x9a50b8f172478bebb14bba449fa9397414a04a494722de02bf5d012f5dea350d
(7) 0xfab401555d42ff3e8c0fcd746f92b1fa1472dd09277342a1869ea63b0dfc1714
(8) 0x6c9a8e8228ffb834bbd339e6397c4f246a06669a87688baf6b88eed5ddfd812a
(9) 0xda78c53614a18c01a956099dac1198a1c56164ad79ce21dcca3347a4e8a9a94d

HD Wallet
==================
Mnemonic:      blast foil hole pepper laptop deer neglect glad group allow curve potato
Base HD Path:  m/44'/60'/0'/0/{account_index}

Default Gas Price
==================
2000000000

BlockGas Limit
==================
30000000

Call Gas Limit
==================
50000000

Chain
==================
Hardfork: shanghai
Id:       1337

RPC Listening on 127.0.0.1:8545
```
