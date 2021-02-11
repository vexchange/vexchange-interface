'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var JSBI = _interopDefault(require('jsbi'));
var invariant = _interopDefault(require('tiny-invariant'));
var networks = require('@ethersproject/networks');
var providers = require('@ethersproject/providers');
var contracts = require('@ethersproject/contracts');
var warning = _interopDefault(require('tiny-warning'));
var address = require('@ethersproject/address');
var solidity = require('@ethersproject/solidity');
var _Big = _interopDefault(require('big.js'));
var toFormat = _interopDefault(require('toformat'));
var _Decimal = _interopDefault(require('decimal.js-light'));

var _SOLIDITY_TYPE_MAXIMA;

(function (ChainId) {
  ChainId[ChainId["MAINNET"] = 1] = "MAINNET";
  ChainId[ChainId["ROPSTEN"] = 3] = "ROPSTEN";
  ChainId[ChainId["RINKEBY"] = 4] = "RINKEBY";
  ChainId[ChainId["G\xD6RLI"] = 5] = "G\xD6RLI";
  ChainId[ChainId["KOVAN"] = 42] = "KOVAN";
})(exports.ChainId || (exports.ChainId = {}));

(function (TradeType) {
  TradeType[TradeType["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType[TradeType["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
})(exports.TradeType || (exports.TradeType = {}));

(function (Rounding) {
  Rounding[Rounding["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding[Rounding["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding[Rounding["ROUND_UP"] = 2] = "ROUND_UP";
})(exports.Rounding || (exports.Rounding = {}));

var FACTORY_ADDRESS = '0xa876ea32b4540780a51fdf795a28ba1930231aa9';
var INIT_CODE_HASH = '0x562f2d7da4edf65b4ccd515d0735f351468cd0b5af54e7395c6890f88247e6d5';
var MINIMUM_LIQUIDITY = /*#__PURE__*/JSBI.BigInt(1000); // exports for internal consumption

var ZERO = /*#__PURE__*/JSBI.BigInt(0);
var ONE = /*#__PURE__*/JSBI.BigInt(1);
var TWO = /*#__PURE__*/JSBI.BigInt(2);
var THREE = /*#__PURE__*/JSBI.BigInt(3);
var FIVE = /*#__PURE__*/JSBI.BigInt(5);
var TEN = /*#__PURE__*/JSBI.BigInt(10);
var _100 = /*#__PURE__*/JSBI.BigInt(100);
var _997 = /*#__PURE__*/JSBI.BigInt(997);
var _1000 = /*#__PURE__*/JSBI.BigInt(1000);
var SolidityType;

(function (SolidityType) {
  SolidityType["uint8"] = "uint8";
  SolidityType["uint256"] = "uint256";
})(SolidityType || (SolidityType = {}));

var SOLIDITY_TYPE_MAXIMA = (_SOLIDITY_TYPE_MAXIMA = {}, _SOLIDITY_TYPE_MAXIMA[SolidityType.uint8] = /*#__PURE__*/JSBI.BigInt('0xff'), _SOLIDITY_TYPE_MAXIMA[SolidityType.uint256] = /*#__PURE__*/JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'), _SOLIDITY_TYPE_MAXIMA);

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o) {
  var i = 0;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  i = o[Symbol.iterator]();
  return i.next.bind(i);
}

// see https://stackoverflow.com/a/41102306
var CAN_SET_PROTOTYPE = ('setPrototypeOf' in Object);
var InsufficientReservesError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(InsufficientReservesError, _Error);

  function InsufficientReservesError() {
    var _this;

    _this = _Error.call(this) || this;
    _this.isInsufficientReservesError = true;
    _this.name = _this.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this), (this instanceof InsufficientReservesError ? this.constructor : void 0).prototype);
    return _this;
  }

  return InsufficientReservesError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
var InsufficientInputAmountError = /*#__PURE__*/function (_Error2) {
  _inheritsLoose(InsufficientInputAmountError, _Error2);

  function InsufficientInputAmountError() {
    var _this2;

    _this2 = _Error2.call(this) || this;
    _this2.isInsufficientInputAmountError = true;
    _this2.name = _this2.constructor.name;
    if (CAN_SET_PROTOTYPE) Object.setPrototypeOf(_assertThisInitialized(_this2), (this instanceof InsufficientInputAmountError ? this.constructor : void 0).prototype);
    return _this2;
  }

  return InsufficientInputAmountError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

var ERC20 = [
	{
		constant: true,
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				name: "",
				type: "uint8"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [
			{
				name: "",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

function validateSolidityTypeInstance(value, solidityType) {
  !JSBI.greaterThanOrEqual(value, ZERO) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
  !JSBI.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]) ?  invariant(false, value + " is not a " + solidityType + ".")  : void 0;
} // warns if addresses are not checksummed

function validateAndParseAddress(address$1) {
  try {
    var checksummedAddress = address.getAddress(address$1);
    "development" !== "production" ? warning(address$1 === checksummedAddress, address$1 + " is not checksummed.") : void 0;
    return checksummedAddress;
  } catch (error) {
      invariant(false, address$1 + " is not a valid address.")  ;
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI ? bigintIsh : typeof bigintIsh === 'bigint' ? JSBI.BigInt(bigintIsh.toString()) : JSBI.BigInt(bigintIsh);
} // mock the on-chain sqrt function

function sqrt(y) {
  validateSolidityTypeInstance(y, SolidityType.uint256);
  var z = ZERO;
  var x;

  if (JSBI.greaterThan(y, THREE)) {
    z = y;
    x = JSBI.add(JSBI.divide(y, TWO), ONE);

    while (JSBI.lessThan(x, z)) {
      z = x;
      x = JSBI.divide(JSBI.add(JSBI.divide(y, x), x), TWO);
    }
  } else if (JSBI.notEqual(y, ZERO)) {
    z = ONE;
  }

  return z;
} // given an array of items sorted by `comparator`, insert an item into its sort index and constrain the size to
// `maxSize` by removing the last item

function sortedInsert(items, add, maxSize, comparator) {
  !(maxSize > 0) ?  invariant(false, 'MAX_SIZE_ZERO')  : void 0; // this is an invariant because the interface cannot return multiple removed items if items.length exceeds maxSize

  !(items.length <= maxSize) ?  invariant(false, 'ITEMS_SIZE')  : void 0; // short circuit first item add

  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    var isFull = items.length === maxSize; // short circuit if full and the additional item does not come before the last item

    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }

    var lo = 0,
        hi = items.length;

    while (lo < hi) {
      var mid = lo + hi >>> 1;

      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

var _CACHE, _VVET;
var CACHE = (_CACHE = {}, _CACHE[exports.ChainId.MAINNET] = {
  '0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A': 9 // DGD

}, _CACHE);
var Token = /*#__PURE__*/function () {
  function Token(chainId, address, decimals, symbol, name) {
    validateSolidityTypeInstance(JSBI.BigInt(decimals), SolidityType.uint8);
    this.chainId = chainId;
    this.address = validateAndParseAddress(address);
    this.decimals = decimals;
    if (typeof symbol === 'string') this.symbol = symbol;
    if (typeof name === 'string') this.name = name;
  }

  Token.fetchData = function fetchData(chainId, address, provider, symbol, name) {
    try {
      var _CACHE2, _CACHE2$chainId;

      var _temp3 = function _temp3(parsedDecimals) {
        return new Token(chainId, address, parsedDecimals, symbol, name);
      };

      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(chainId));

      var _temp4 = typeof ((_CACHE2 = CACHE) === null || _CACHE2 === void 0 ? void 0 : (_CACHE2$chainId = _CACHE2[chainId]) === null || _CACHE2$chainId === void 0 ? void 0 : _CACHE2$chainId[address]) === 'number';

      return Promise.resolve(_temp4 ? _temp3(CACHE[chainId][address]) : Promise.resolve(new contracts.Contract(address, ERC20, provider).decimals().then(function (decimals) {
        var _CACHE3, _extends2, _extends3;

        CACHE = _extends(_extends({}, CACHE), {}, (_extends3 = {}, _extends3[chainId] = _extends(_extends({}, (_CACHE3 = CACHE) === null || _CACHE3 === void 0 ? void 0 : _CACHE3[chainId]), {}, (_extends2 = {}, _extends2[address] = decimals, _extends2)), _extends3));
        return decimals;
      })).then(_temp3));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _proto = Token.prototype;

  _proto.equals = function equals(other) {
    var equal = this.chainId === other.chainId && this.address === other.address;

    if (equal) {
      !(this.decimals === other.decimals) ?  invariant(false, 'DECIMALS')  : void 0;
      if (this.symbol && other.symbol) !(this.symbol === other.symbol) ?  invariant(false, 'SYMBOL')  : void 0;
      if (this.name && other.name) !(this.name === other.name) ?  invariant(false, 'NAME')  : void 0;
    }

    return equal;
  };

  _proto.sortsBefore = function sortsBefore(other) {
    !(this.chainId === other.chainId) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    !(this.address !== other.address) ?  invariant(false, 'ADDRESSES')  : void 0;
    return this.address.toLowerCase() < other.address.toLowerCase();
  };

  return Token;
}();
var VVET = (_VVET = {}, _VVET[exports.ChainId.MAINNET] = /*#__PURE__*/new Token(exports.ChainId.MAINNET, '0x37a3e90ff4a6eb312097367e0210d7d7d9699fdd', 18, 'VVET', 'Veiled Vet'), _VVET[exports.ChainId.ROPSTEN] = /*#__PURE__*/new Token(exports.ChainId.ROPSTEN, '0x37a3e90ff4a6eb312097367e0210d7d7d9699fdd', 18, 'VVET', 'Veiled Vet'), _VVET[exports.ChainId.RINKEBY] = /*#__PURE__*/new Token(exports.ChainId.RINKEBY, '0x37a3e90ff4a6eb312097367e0210d7d7d9699fdd', 18, 'VVET', 'Veiled Vet'), _VVET[exports.ChainId.GÖRLI] = /*#__PURE__*/new Token(exports.ChainId.GÖRLI, '0x37a3e90ff4a6eb312097367e0210d7d7d9699fdd', 18, 'VVET', 'Veiled Vet'), _VVET[exports.ChainId.KOVAN] = /*#__PURE__*/new Token(exports.ChainId.KOVAN, '0x37a3e90ff4a6eb312097367e0210d7d7d9699fdd', 18, 'VVET', 'Veiled Vet'), _VVET);

var abi = [
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "Burn",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		name: "Mint",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0In",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1In",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount0Out",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amount1Out",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "Swap",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint112",
				name: "reserve0",
				type: "uint112"
			},
			{
				indexed: false,
				internalType: "uint112",
				name: "reserve1",
				type: "uint112"
			}
		],
		name: "Sync",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		inputs: [
		],
		name: "DOMAIN_SEPARATOR",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "MINIMUM_LIQUIDITY",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "PERMIT_TYPEHASH",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			}
		],
		name: "allowance",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "burn",
		outputs: [
			{
				internalType: "uint256",
				name: "amount0",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "decimals",
		outputs: [
			{
				internalType: "uint8",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "factory",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getReserves",
		outputs: [
			{
				internalType: "uint112",
				name: "reserve0",
				type: "uint112"
			},
			{
				internalType: "uint112",
				name: "reserve1",
				type: "uint112"
			},
			{
				internalType: "uint32",
				name: "blockTimestampLast",
				type: "uint32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "kLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "mint",
		outputs: [
			{
				internalType: "uint256",
				name: "liquidity",
				type: "uint256"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "nonces",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "spender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "uint8",
				name: "v",
				type: "uint8"
			},
			{
				internalType: "bytes32",
				name: "r",
				type: "bytes32"
			},
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "permit",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "price0CumulativeLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "price1CumulativeLast",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			}
		],
		name: "skim",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "amount0Out",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "amount1Out",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "swap",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "sync",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token0",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "token1",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "totalSupply",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transfer",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "value",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];
var ast = {
	absolutePath: "interfaces/IUniswapV2Pair.sol",
	exportedSymbols: {
		IUniswapV2Pair: [
			520
		]
	},
	id: 521,
	license: null,
	nodeType: "SourceUnit",
	nodes: [
		{
			id: 280,
			literals: [
				"solidity",
				">=",
				"0.5",
				".0"
			],
			nodeType: "PragmaDirective",
			src: "0:24:4"
		},
		{
			abstract: false,
			baseContracts: [
			],
			contractDependencies: [
			],
			contractKind: "interface",
			documentation: null,
			fullyImplemented: false,
			id: 520,
			linearizedBaseContracts: [
				520
			],
			name: "IUniswapV2Pair",
			nodeType: "ContractDefinition",
			nodes: [
				{
					anonymous: false,
					documentation: null,
					id: 288,
					name: "Approval",
					nodeType: "EventDefinition",
					parameters: {
						id: 287,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 282,
								indexed: true,
								mutability: "mutable",
								name: "owner",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 288,
								src: "72:21:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 281,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "72:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 284,
								indexed: true,
								mutability: "mutable",
								name: "spender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 288,
								src: "95:23:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 283,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "95:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 286,
								indexed: false,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 288,
								src: "120:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 285,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "120:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "71:60:4"
					},
					src: "57:75:4"
				},
				{
					anonymous: false,
					documentation: null,
					id: 296,
					name: "Transfer",
					nodeType: "EventDefinition",
					parameters: {
						id: 295,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 290,
								indexed: true,
								mutability: "mutable",
								name: "from",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 296,
								src: "152:20:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 289,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "152:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 292,
								indexed: true,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 296,
								src: "174:18:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 291,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "174:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 294,
								indexed: false,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 296,
								src: "194:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 293,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "194:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "151:54:4"
					},
					src: "137:69:4"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "06fdde03",
					id: 301,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "name",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 297,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "225:2:4"
					},
					returnParameters: {
						id: 300,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 299,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 301,
								src: "251:13:4",
								stateVariable: false,
								storageLocation: "memory",
								typeDescriptions: {
									typeIdentifier: "t_string_memory_ptr",
									typeString: "string"
								},
								typeName: {
									id: 298,
									name: "string",
									nodeType: "ElementaryTypeName",
									src: "251:6:4",
									typeDescriptions: {
										typeIdentifier: "t_string_storage_ptr",
										typeString: "string"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "250:15:4"
					},
					scope: 520,
					src: "212:54:4",
					stateMutability: "pure",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "95d89b41",
					id: 306,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "symbol",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 302,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "286:2:4"
					},
					returnParameters: {
						id: 305,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 304,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 306,
								src: "312:13:4",
								stateVariable: false,
								storageLocation: "memory",
								typeDescriptions: {
									typeIdentifier: "t_string_memory_ptr",
									typeString: "string"
								},
								typeName: {
									id: 303,
									name: "string",
									nodeType: "ElementaryTypeName",
									src: "312:6:4",
									typeDescriptions: {
										typeIdentifier: "t_string_storage_ptr",
										typeString: "string"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "311:15:4"
					},
					scope: 520,
					src: "271:56:4",
					stateMutability: "pure",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "313ce567",
					id: 311,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "decimals",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 307,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "349:2:4"
					},
					returnParameters: {
						id: 310,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 309,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 311,
								src: "375:5:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint8",
									typeString: "uint8"
								},
								typeName: {
									id: 308,
									name: "uint8",
									nodeType: "ElementaryTypeName",
									src: "375:5:4",
									typeDescriptions: {
										typeIdentifier: "t_uint8",
										typeString: "uint8"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "374:7:4"
					},
					scope: 520,
					src: "332:50:4",
					stateMutability: "pure",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "18160ddd",
					id: 316,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "totalSupply",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 312,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "407:2:4"
					},
					returnParameters: {
						id: 315,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 314,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 316,
								src: "433:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 313,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "433:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "432:6:4"
					},
					scope: 520,
					src: "387:52:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "70a08231",
					id: 323,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "balanceOf",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 319,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 318,
								mutability: "mutable",
								name: "owner",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 323,
								src: "463:13:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 317,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "463:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "462:15:4"
					},
					returnParameters: {
						id: 322,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 321,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 323,
								src: "501:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 320,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "501:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "500:6:4"
					},
					scope: 520,
					src: "444:63:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "dd62ed3e",
					id: 332,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "allowance",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 328,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 325,
								mutability: "mutable",
								name: "owner",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 332,
								src: "531:13:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 324,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "531:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 327,
								mutability: "mutable",
								name: "spender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 332,
								src: "546:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 326,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "546:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "530:32:4"
					},
					returnParameters: {
						id: 331,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 330,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 332,
								src: "586:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 329,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "586:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "585:6:4"
					},
					scope: 520,
					src: "512:80:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "095ea7b3",
					id: 341,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "approve",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 337,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 334,
								mutability: "mutable",
								name: "spender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 341,
								src: "615:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 333,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "615:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 336,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 341,
								src: "632:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 335,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "632:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "614:29:4"
					},
					returnParameters: {
						id: 340,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 339,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 341,
								src: "662:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bool",
									typeString: "bool"
								},
								typeName: {
									id: 338,
									name: "bool",
									nodeType: "ElementaryTypeName",
									src: "662:4:4",
									typeDescriptions: {
										typeIdentifier: "t_bool",
										typeString: "bool"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "661:6:4"
					},
					scope: 520,
					src: "598:70:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "a9059cbb",
					id: 350,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "transfer",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 346,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 343,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 350,
								src: "691:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 342,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "691:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 345,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 350,
								src: "703:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 344,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "703:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "690:24:4"
					},
					returnParameters: {
						id: 349,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 348,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 350,
								src: "733:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bool",
									typeString: "bool"
								},
								typeName: {
									id: 347,
									name: "bool",
									nodeType: "ElementaryTypeName",
									src: "733:4:4",
									typeDescriptions: {
										typeIdentifier: "t_bool",
										typeString: "bool"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "732:6:4"
					},
					scope: 520,
					src: "673:66:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "23b872dd",
					id: 361,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "transferFrom",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 357,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 352,
								mutability: "mutable",
								name: "from",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 361,
								src: "766:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 351,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "766:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 354,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 361,
								src: "780:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 353,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "780:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 356,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 361,
								src: "792:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 355,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "792:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "765:38:4"
					},
					returnParameters: {
						id: 360,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 359,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 361,
								src: "822:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bool",
									typeString: "bool"
								},
								typeName: {
									id: 358,
									name: "bool",
									nodeType: "ElementaryTypeName",
									src: "822:4:4",
									typeDescriptions: {
										typeIdentifier: "t_bool",
										typeString: "bool"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "821:6:4"
					},
					scope: 520,
					src: "744:84:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "3644e515",
					id: 366,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "DOMAIN_SEPARATOR",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 362,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "859:2:4"
					},
					returnParameters: {
						id: 365,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 364,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 366,
								src: "885:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bytes32",
									typeString: "bytes32"
								},
								typeName: {
									id: 363,
									name: "bytes32",
									nodeType: "ElementaryTypeName",
									src: "885:7:4",
									typeDescriptions: {
										typeIdentifier: "t_bytes32",
										typeString: "bytes32"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "884:9:4"
					},
					scope: 520,
					src: "834:60:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "30adf81f",
					id: 371,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "PERMIT_TYPEHASH",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 367,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "923:2:4"
					},
					returnParameters: {
						id: 370,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 369,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 371,
								src: "949:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bytes32",
									typeString: "bytes32"
								},
								typeName: {
									id: 368,
									name: "bytes32",
									nodeType: "ElementaryTypeName",
									src: "949:7:4",
									typeDescriptions: {
										typeIdentifier: "t_bytes32",
										typeString: "bytes32"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "948:9:4"
					},
					scope: 520,
					src: "899:59:4",
					stateMutability: "pure",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "7ecebe00",
					id: 378,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "nonces",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 374,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 373,
								mutability: "mutable",
								name: "owner",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 378,
								src: "979:13:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 372,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "979:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "978:15:4"
					},
					returnParameters: {
						id: 377,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 376,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 378,
								src: "1017:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 375,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1017:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1016:6:4"
					},
					scope: 520,
					src: "963:60:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "d505accf",
					id: 395,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "permit",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 393,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 380,
								mutability: "mutable",
								name: "owner",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1045:13:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 379,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1045:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 382,
								mutability: "mutable",
								name: "spender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1060:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 381,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1060:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 384,
								mutability: "mutable",
								name: "value",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1077:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 383,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1077:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 386,
								mutability: "mutable",
								name: "deadline",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1089:13:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 385,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1089:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 388,
								mutability: "mutable",
								name: "v",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1104:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint8",
									typeString: "uint8"
								},
								typeName: {
									id: 387,
									name: "uint8",
									nodeType: "ElementaryTypeName",
									src: "1104:5:4",
									typeDescriptions: {
										typeIdentifier: "t_uint8",
										typeString: "uint8"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 390,
								mutability: "mutable",
								name: "r",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1113:9:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bytes32",
									typeString: "bytes32"
								},
								typeName: {
									id: 389,
									name: "bytes32",
									nodeType: "ElementaryTypeName",
									src: "1113:7:4",
									typeDescriptions: {
										typeIdentifier: "t_bytes32",
										typeString: "bytes32"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 392,
								mutability: "mutable",
								name: "s",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 395,
								src: "1124:9:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_bytes32",
									typeString: "bytes32"
								},
								typeName: {
									id: 391,
									name: "bytes32",
									nodeType: "ElementaryTypeName",
									src: "1124:7:4",
									typeDescriptions: {
										typeIdentifier: "t_bytes32",
										typeString: "bytes32"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1044:90:4"
					},
					returnParameters: {
						id: 394,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1143:0:4"
					},
					scope: 520,
					src: "1029:115:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					anonymous: false,
					documentation: null,
					id: 403,
					name: "Mint",
					nodeType: "EventDefinition",
					parameters: {
						id: 402,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 397,
								indexed: true,
								mutability: "mutable",
								name: "sender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 403,
								src: "1161:22:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 396,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1161:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 399,
								indexed: false,
								mutability: "mutable",
								name: "amount0",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 403,
								src: "1185:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 398,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1185:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 401,
								indexed: false,
								mutability: "mutable",
								name: "amount1",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 403,
								src: "1199:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 400,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1199:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1160:52:4"
					},
					src: "1150:63:4"
				},
				{
					anonymous: false,
					documentation: null,
					id: 413,
					name: "Burn",
					nodeType: "EventDefinition",
					parameters: {
						id: 412,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 405,
								indexed: true,
								mutability: "mutable",
								name: "sender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 413,
								src: "1229:22:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 404,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1229:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 407,
								indexed: false,
								mutability: "mutable",
								name: "amount0",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 413,
								src: "1253:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 406,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1253:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 409,
								indexed: false,
								mutability: "mutable",
								name: "amount1",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 413,
								src: "1267:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 408,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1267:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 411,
								indexed: true,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 413,
								src: "1281:18:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 410,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1281:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1228:72:4"
					},
					src: "1218:83:4"
				},
				{
					anonymous: false,
					documentation: null,
					id: 427,
					name: "Swap",
					nodeType: "EventDefinition",
					parameters: {
						id: 426,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 415,
								indexed: true,
								mutability: "mutable",
								name: "sender",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1326:22:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 414,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1326:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 417,
								indexed: false,
								mutability: "mutable",
								name: "amount0In",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1358:14:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 416,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1358:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 419,
								indexed: false,
								mutability: "mutable",
								name: "amount1In",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1382:14:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 418,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1382:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 421,
								indexed: false,
								mutability: "mutable",
								name: "amount0Out",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1406:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 420,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1406:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 423,
								indexed: false,
								mutability: "mutable",
								name: "amount1Out",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1431:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 422,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1431:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 425,
								indexed: true,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 427,
								src: "1456:18:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 424,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1456:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1316:164:4"
					},
					src: "1306:175:4"
				},
				{
					anonymous: false,
					documentation: null,
					id: 433,
					name: "Sync",
					nodeType: "EventDefinition",
					parameters: {
						id: 432,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 429,
								indexed: false,
								mutability: "mutable",
								name: "reserve0",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 433,
								src: "1497:16:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint112",
									typeString: "uint112"
								},
								typeName: {
									id: 428,
									name: "uint112",
									nodeType: "ElementaryTypeName",
									src: "1497:7:4",
									typeDescriptions: {
										typeIdentifier: "t_uint112",
										typeString: "uint112"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 431,
								indexed: false,
								mutability: "mutable",
								name: "reserve1",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 433,
								src: "1515:16:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint112",
									typeString: "uint112"
								},
								typeName: {
									id: 430,
									name: "uint112",
									nodeType: "ElementaryTypeName",
									src: "1515:7:4",
									typeDescriptions: {
										typeIdentifier: "t_uint112",
										typeString: "uint112"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1496:36:4"
					},
					src: "1486:47:4"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "ba9a7a56",
					id: 438,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "MINIMUM_LIQUIDITY",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 434,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1565:2:4"
					},
					returnParameters: {
						id: 437,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 436,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 438,
								src: "1591:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 435,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1591:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1590:6:4"
					},
					scope: 520,
					src: "1539:58:4",
					stateMutability: "pure",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "c45a0155",
					id: 443,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "factory",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 439,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1618:2:4"
					},
					returnParameters: {
						id: 442,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 441,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 443,
								src: "1644:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 440,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1644:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1643:9:4"
					},
					scope: 520,
					src: "1602:51:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "0dfe1681",
					id: 448,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "token0",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 444,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1673:2:4"
					},
					returnParameters: {
						id: 447,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 446,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 448,
								src: "1699:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 445,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1699:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1698:9:4"
					},
					scope: 520,
					src: "1658:50:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "d21220a7",
					id: 453,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "token1",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 449,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1728:2:4"
					},
					returnParameters: {
						id: 452,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 451,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 453,
								src: "1754:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 450,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "1754:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1753:9:4"
					},
					scope: 520,
					src: "1713:50:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "0902f1ac",
					id: 462,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "getReserves",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 454,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1788:2:4"
					},
					returnParameters: {
						id: 461,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 456,
								mutability: "mutable",
								name: "reserve0",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 462,
								src: "1814:16:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint112",
									typeString: "uint112"
								},
								typeName: {
									id: 455,
									name: "uint112",
									nodeType: "ElementaryTypeName",
									src: "1814:7:4",
									typeDescriptions: {
										typeIdentifier: "t_uint112",
										typeString: "uint112"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 458,
								mutability: "mutable",
								name: "reserve1",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 462,
								src: "1832:16:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint112",
									typeString: "uint112"
								},
								typeName: {
									id: 457,
									name: "uint112",
									nodeType: "ElementaryTypeName",
									src: "1832:7:4",
									typeDescriptions: {
										typeIdentifier: "t_uint112",
										typeString: "uint112"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 460,
								mutability: "mutable",
								name: "blockTimestampLast",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 462,
								src: "1850:25:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint32",
									typeString: "uint32"
								},
								typeName: {
									id: 459,
									name: "uint32",
									nodeType: "ElementaryTypeName",
									src: "1850:6:4",
									typeDescriptions: {
										typeIdentifier: "t_uint32",
										typeString: "uint32"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1813:63:4"
					},
					scope: 520,
					src: "1768:109:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "5909c0d5",
					id: 467,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "price0CumulativeLast",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 463,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1911:2:4"
					},
					returnParameters: {
						id: 466,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 465,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 467,
								src: "1937:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 464,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "1937:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "1936:6:4"
					},
					scope: 520,
					src: "1882:61:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "5a3d5493",
					id: 472,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "price1CumulativeLast",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 468,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "1977:2:4"
					},
					returnParameters: {
						id: 471,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 470,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 472,
								src: "2003:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 469,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2003:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2002:6:4"
					},
					scope: 520,
					src: "1948:61:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "7464fc3d",
					id: 477,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "kLast",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 473,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2028:2:4"
					},
					returnParameters: {
						id: 476,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 475,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 477,
								src: "2054:4:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 474,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2054:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2053:6:4"
					},
					scope: 520,
					src: "2014:46:4",
					stateMutability: "view",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "6a627842",
					id: 484,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "mint",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 480,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 479,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 484,
								src: "2080:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 478,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2080:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2079:12:4"
					},
					returnParameters: {
						id: 483,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 482,
								mutability: "mutable",
								name: "liquidity",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 484,
								src: "2110:14:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 481,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2110:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2109:16:4"
					},
					scope: 520,
					src: "2066:60:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "89afcb44",
					id: 493,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "burn",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 487,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 486,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 493,
								src: "2145:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 485,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2145:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2144:12:4"
					},
					returnParameters: {
						id: 492,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 489,
								mutability: "mutable",
								name: "amount0",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 493,
								src: "2175:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 488,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2175:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 491,
								mutability: "mutable",
								name: "amount1",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 493,
								src: "2189:12:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 490,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2189:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2174:28:4"
					},
					scope: 520,
					src: "2131:72:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "022c0d9f",
					id: 504,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "swap",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 502,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 495,
								mutability: "mutable",
								name: "amount0Out",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 504,
								src: "2222:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 494,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2222:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 497,
								mutability: "mutable",
								name: "amount1Out",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 504,
								src: "2239:15:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_uint256",
									typeString: "uint256"
								},
								typeName: {
									id: 496,
									name: "uint",
									nodeType: "ElementaryTypeName",
									src: "2239:4:4",
									typeDescriptions: {
										typeIdentifier: "t_uint256",
										typeString: "uint256"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 499,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 504,
								src: "2256:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 498,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2256:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 501,
								mutability: "mutable",
								name: "data",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 504,
								src: "2268:19:4",
								stateVariable: false,
								storageLocation: "calldata",
								typeDescriptions: {
									typeIdentifier: "t_bytes_calldata_ptr",
									typeString: "bytes"
								},
								typeName: {
									id: 500,
									name: "bytes",
									nodeType: "ElementaryTypeName",
									src: "2268:5:4",
									typeDescriptions: {
										typeIdentifier: "t_bytes_storage_ptr",
										typeString: "bytes"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2221:67:4"
					},
					returnParameters: {
						id: 503,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2297:0:4"
					},
					scope: 520,
					src: "2208:90:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "bc25cf77",
					id: 509,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "skim",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 507,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 506,
								mutability: "mutable",
								name: "to",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 509,
								src: "2317:10:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 505,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2317:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2316:12:4"
					},
					returnParameters: {
						id: 508,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2337:0:4"
					},
					scope: 520,
					src: "2303:35:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "fff6cae9",
					id: 512,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "sync",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 510,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2356:2:4"
					},
					returnParameters: {
						id: 511,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2367:0:4"
					},
					scope: 520,
					src: "2343:25:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				},
				{
					body: null,
					documentation: null,
					functionSelector: "485cc955",
					id: 519,
					implemented: false,
					kind: "function",
					modifiers: [
					],
					name: "initialize",
					nodeType: "FunctionDefinition",
					overrides: null,
					parameters: {
						id: 517,
						nodeType: "ParameterList",
						parameters: [
							{
								constant: false,
								id: 514,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 519,
								src: "2394:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 513,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2394:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							},
							{
								constant: false,
								id: 516,
								mutability: "mutable",
								name: "",
								nodeType: "VariableDeclaration",
								overrides: null,
								scope: 519,
								src: "2403:7:4",
								stateVariable: false,
								storageLocation: "default",
								typeDescriptions: {
									typeIdentifier: "t_address",
									typeString: "address"
								},
								typeName: {
									id: 515,
									name: "address",
									nodeType: "ElementaryTypeName",
									src: "2403:7:4",
									stateMutability: "nonpayable",
									typeDescriptions: {
										typeIdentifier: "t_address",
										typeString: "address"
									}
								},
								value: null,
								visibility: "internal"
							}
						],
						src: "2393:18:4"
					},
					returnParameters: {
						id: 518,
						nodeType: "ParameterList",
						parameters: [
						],
						src: "2420:0:4"
					},
					scope: 520,
					src: "2374:47:4",
					stateMutability: "nonpayable",
					virtual: false,
					visibility: "external"
				}
			],
			scope: 521,
			src: "26:2397:4"
		}
	],
	src: "0:2424:4"
};
var contractName = "IUniswapV2Pair";
var dependencies = [
];
var offset = [
	26,
	2423
];
var sha1 = "e20da54f1aa3841c2b532d81cd6cbe2d251a6768";
var source = "pragma solidity >=0.5.0;\n\ninterface IUniswapV2Pair {\n    event Approval(address indexed owner, address indexed spender, uint value);\n    event Transfer(address indexed from, address indexed to, uint value);\n\n    function name() external pure returns (string memory);\n    function symbol() external pure returns (string memory);\n    function decimals() external pure returns (uint8);\n    function totalSupply() external view returns (uint);\n    function balanceOf(address owner) external view returns (uint);\n    function allowance(address owner, address spender) external view returns (uint);\n\n    function approve(address spender, uint value) external returns (bool);\n    function transfer(address to, uint value) external returns (bool);\n    function transferFrom(address from, address to, uint value) external returns (bool);\n\n    function DOMAIN_SEPARATOR() external view returns (bytes32);\n    function PERMIT_TYPEHASH() external pure returns (bytes32);\n    function nonces(address owner) external view returns (uint);\n\n    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;\n\n    event Mint(address indexed sender, uint amount0, uint amount1);\n    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);\n    event Swap(\n        address indexed sender,\n        uint amount0In,\n        uint amount1In,\n        uint amount0Out,\n        uint amount1Out,\n        address indexed to\n    );\n    event Sync(uint112 reserve0, uint112 reserve1);\n\n    function MINIMUM_LIQUIDITY() external pure returns (uint);\n    function factory() external view returns (address);\n    function token0() external view returns (address);\n    function token1() external view returns (address);\n    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);\n    function price0CumulativeLast() external view returns (uint);\n    function price1CumulativeLast() external view returns (uint);\n    function kLast() external view returns (uint);\n\n    function mint(address to) external returns (uint liquidity);\n    function burn(address to) external returns (uint amount0, uint amount1);\n    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;\n    function skim(address to) external;\n    function sync() external;\n\n    function initialize(address, address) external;\n}\n";
var type = "interface";
var IUniswapV2Pair = {
	abi: abi,
	ast: ast,
	contractName: contractName,
	dependencies: dependencies,
	offset: offset,
	sha1: sha1,
	source: source,
	type: type
};

var _toSignificantRoundin, _toFixedRounding;
var Decimal = /*#__PURE__*/toFormat(_Decimal);
var Big = /*#__PURE__*/toFormat(_Big);
var toSignificantRounding = (_toSignificantRoundin = {}, _toSignificantRoundin[exports.Rounding.ROUND_DOWN] = Decimal.ROUND_DOWN, _toSignificantRoundin[exports.Rounding.ROUND_HALF_UP] = Decimal.ROUND_HALF_UP, _toSignificantRoundin[exports.Rounding.ROUND_UP] = Decimal.ROUND_UP, _toSignificantRoundin);
var toFixedRounding = (_toFixedRounding = {}, _toFixedRounding[exports.Rounding.ROUND_DOWN] = 0, _toFixedRounding[exports.Rounding.ROUND_HALF_UP] = 1, _toFixedRounding[exports.Rounding.ROUND_UP] = 3, _toFixedRounding);
var Fraction = /*#__PURE__*/function () {
  function Fraction(numerator, denominator) {
    if (denominator === void 0) {
      denominator = ONE;
    }

    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  } // performs floor division


  var _proto = Fraction.prototype;

  _proto.invert = function invert() {
    return new Fraction(this.denominator, this.numerator);
  };

  _proto.add = function add(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.add(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.add(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.subtract = function subtract(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));

    if (JSBI.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }

    return new Fraction(JSBI.subtract(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator)), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.lessThan = function lessThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.lessThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.equalTo = function equalTo(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.equal(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.greaterThan = function greaterThan(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI.greaterThan(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(otherParsed.numerator, this.denominator));
  };

  _proto.multiply = function multiply(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.numerator), JSBI.multiply(this.denominator, otherParsed.denominator));
  };

  _proto.divide = function divide(other) {
    var otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(JSBI.multiply(this.numerator, otherParsed.denominator), JSBI.multiply(this.denominator, otherParsed.numerator));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(significantDigits) ?  invariant(false, significantDigits + " is not an integer.")  : void 0;
    !(significantDigits > 0) ?  invariant(false, significantDigits + " is not positive.")  : void 0;
    Decimal.set({
      precision: significantDigits + 1,
      rounding: toSignificantRounding[rounding]
    });
    var quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_HALF_UP;
    }

    !Number.isInteger(decimalPlaces) ?  invariant(false, decimalPlaces + " is not an integer.")  : void 0;
    !(decimalPlaces >= 0) ?  invariant(false, decimalPlaces + " is negative.")  : void 0;
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  };

  _createClass(Fraction, [{
    key: "quotient",
    get: function get() {
      return JSBI.divide(this.numerator, this.denominator);
    } // remainder after floor division

  }, {
    key: "remainder",
    get: function get() {
      return new Fraction(JSBI.remainder(this.numerator, this.denominator), this.denominator);
    }
  }]);

  return Fraction;
}();

var Big$1 = /*#__PURE__*/toFormat(_Big);
var TokenAmount = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(TokenAmount, _Fraction);

  // amount _must_ be raw, i.e. in the native representation
  function TokenAmount(token, amount) {
    var _this;

    var parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, SolidityType.uint256);
    _this = _Fraction.call(this, parsedAmount, JSBI.exponentiate(TEN, JSBI.BigInt(token.decimals))) || this;
    _this.token = token;
    return _this;
  }

  var _proto = TokenAmount.prototype;

  _proto.add = function add(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.add(this.raw, other.raw));
  };

  _proto.subtract = function subtract(other) {
    !this.token.equals(other.token) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.token, JSBI.subtract(this.raw, other.raw));
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    return _Fraction.prototype.toSignificant.call(this, significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = this.token.decimals;
    }

    if (rounding === void 0) {
      rounding = exports.Rounding.ROUND_DOWN;
    }

    !(decimalPlaces <= this.token.decimals) ?  invariant(false, 'DECIMALS')  : void 0;
    return _Fraction.prototype.toFixed.call(this, decimalPlaces, format, rounding);
  };

  _proto.toExact = function toExact(format) {
    if (format === void 0) {
      format = {
        groupSeparator: ''
      };
    }

    Big$1.DP = this.token.decimals;
    return new Big$1(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
  };

  _createClass(TokenAmount, [{
    key: "raw",
    get: function get() {
      return this.numerator;
    }
  }]);

  return TokenAmount;
}(Fraction);

var CACHE$1 = {};
var Pair = /*#__PURE__*/function () {
  function Pair(tokenAmountA, tokenAmountB) {
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.liquidityToken = new Token(tokenAmounts[0].token.chainId, Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token), 18, 'UNI-V2', 'Uniswap V2');
    this.tokenAmounts = tokenAmounts;
  }

  Pair.getAddress = function getAddress(tokenA, tokenB) {
    var _CACHE, _CACHE$tokens$0$addre;

    var tokens = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]; // does safety checks

    if (((_CACHE = CACHE$1) === null || _CACHE === void 0 ? void 0 : (_CACHE$tokens$0$addre = _CACHE[tokens[0].address]) === null || _CACHE$tokens$0$addre === void 0 ? void 0 : _CACHE$tokens$0$addre[tokens[1].address]) === undefined) {
      var _CACHE2, _extends2, _extends3;

      CACHE$1 = _extends(_extends({}, CACHE$1), {}, (_extends3 = {}, _extends3[tokens[0].address] = _extends(_extends({}, (_CACHE2 = CACHE$1) === null || _CACHE2 === void 0 ? void 0 : _CACHE2[tokens[0].address]), {}, (_extends2 = {}, _extends2[tokens[1].address] = address.getCreate2Address(FACTORY_ADDRESS, solidity.keccak256(['bytes'], [solidity.pack(['address', 'address'], [tokens[0].address, tokens[1].address])]), INIT_CODE_HASH), _extends2)), _extends3));
    }

    return CACHE$1[tokens[0].address][tokens[1].address];
  };

  Pair.fetchData = function fetchData(tokenA, tokenB, provider) {
    try {
      if (provider === undefined) provider = providers.getDefaultProvider(networks.getNetwork(tokenA.chainId));
      !(tokenA.chainId === tokenB.chainId) ? "development" !== "production" ? invariant(false, 'CHAIN_ID') : invariant(false) : void 0;
      var address = Pair.getAddress(tokenA, tokenB);
      return Promise.resolve(new contracts.Contract(address, IUniswapV2Pair.abi, provider).getReserves()).then(function (_ref) {
        var reserves0 = _ref[0],
            reserves1 = _ref[1];
        var balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
        return new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]));
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _proto = Pair.prototype;

  _proto.reserveOf = function reserveOf(token) {
    !(token.equals(this.token0) || token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  };

  _proto.getOutputAmount = function getOutputAmount(inputAmount) {
    !(inputAmount.token.equals(this.token0) || inputAmount.token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }

    var inputReserve = this.reserveOf(inputAmount.token);
    var outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var inputAmountWithFee = JSBI.multiply(inputAmount.raw, _997);
    var numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw);
    var denominator = JSBI.add(JSBI.multiply(inputReserve.raw, _1000), inputAmountWithFee);
    var outputAmount = new TokenAmount(inputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.divide(numerator, denominator));

    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getInputAmount = function getInputAmount(outputAmount) {
    !(outputAmount.token.equals(this.token0) || outputAmount.token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;

    if (JSBI.equal(this.reserve0.raw, ZERO) || JSBI.equal(this.reserve1.raw, ZERO) || JSBI.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }

    var outputReserve = this.reserveOf(outputAmount.token);
    var inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    var numerator = JSBI.multiply(JSBI.multiply(inputReserve.raw, outputAmount.raw), _1000);
    var denominator = JSBI.multiply(JSBI.subtract(outputReserve.raw, outputAmount.raw), _997);
    var inputAmount = new TokenAmount(outputAmount.token.equals(this.token0) ? this.token1 : this.token0, JSBI.add(JSBI.divide(numerator, denominator), ONE));
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  };

  _proto.getLiquidityMinted = function getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
    ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    !(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    var liquidity;

    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      var amount0 = JSBI.divide(JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      var amount1 = JSBI.divide(JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }

    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }

    return new TokenAmount(this.liquidityToken, liquidity);
  };

  _proto.getLiquidityValue = function getLiquidityValue(token, totalSupply, liquidity, feeOn, kLast) {
    if (feeOn === void 0) {
      feeOn = false;
    }

    !(token.equals(this.token0) || token.equals(this.token1)) ?  invariant(false, 'TOKEN')  : void 0;
    !totalSupply.token.equals(this.liquidityToken) ?  invariant(false, 'TOTAL_SUPPLY')  : void 0;
    !liquidity.token.equals(this.liquidityToken) ?  invariant(false, 'LIQUIDITY')  : void 0;
    !JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw) ?  invariant(false, 'LIQUIDITY')  : void 0;
    var totalSupplyAdjusted;

    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      !!!kLast ?  invariant(false, 'K_LAST')  : void 0;
      var kLastParsed = parseBigintIsh(kLast);

      if (!JSBI.equal(kLastParsed, ZERO)) {
        var rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        var rootKLast = sqrt(kLastParsed);

        if (JSBI.greaterThan(rootK, rootKLast)) {
          var numerator = JSBI.multiply(totalSupply.raw, JSBI.subtract(rootK, rootKLast));
          var denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          var feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(token, JSBI.divide(JSBI.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw));
  };

  _createClass(Pair, [{
    key: "token0",
    get: function get() {
      return this.tokenAmounts[0].token;
    }
  }, {
    key: "token1",
    get: function get() {
      return this.tokenAmounts[1].token;
    }
  }, {
    key: "reserve0",
    get: function get() {
      return this.tokenAmounts[0];
    }
  }, {
    key: "reserve1",
    get: function get() {
      return this.tokenAmounts[1];
    }
  }]);

  return Pair;
}();

var Price = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Price, _Fraction);

  // denominator and numerator _must_ be raw, i.e. in the native representation
  function Price(baseToken, quoteToken, denominator, numerator) {
    var _this;

    _this = _Fraction.call(this, numerator, denominator) || this;
    _this.baseToken = baseToken;
    _this.quoteToken = quoteToken;
    _this.scalar = new Fraction(JSBI.exponentiate(TEN, JSBI.BigInt(baseToken.decimals)), JSBI.exponentiate(TEN, JSBI.BigInt(quoteToken.decimals)));
    return _this;
  }

  Price.fromRoute = function fromRoute(route) {
    var prices = [];

    for (var _iterator = _createForOfIteratorHelperLoose(route.pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      prices.push(route.path[i].equals(pair.token0) ? new Price(pair.reserve0.token, pair.reserve1.token, pair.reserve0.raw, pair.reserve1.raw) : new Price(pair.reserve1.token, pair.reserve0.token, pair.reserve1.raw, pair.reserve0.raw));
    }

    return prices.slice(1).reduce(function (accumulator, currentValue) {
      return accumulator.multiply(currentValue);
    }, prices[0]);
  };

  var _proto = Price.prototype;

  _proto.invert = function invert() {
    return new Price(this.quoteToken, this.baseToken, this.numerator, this.denominator);
  };

  _proto.multiply = function multiply(other) {
    !this.quoteToken.equals(other.baseToken) ?  invariant(false, 'BASE')  : void 0;

    var fraction = _Fraction.prototype.multiply.call(this, other);

    return new Price(this.baseToken, other.quoteToken, fraction.denominator, fraction.numerator);
  } // performs floor division on overflow
  ;

  _proto.quote = function quote(tokenAmount) {
    !tokenAmount.token.equals(this.baseToken) ?  invariant(false, 'TOKEN')  : void 0;
    return new TokenAmount(this.quoteToken, _Fraction.prototype.multiply.call(this, tokenAmount.raw).quotient);
  };

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 6;
    }

    return this.adjusted.toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 4;
    }

    return this.adjusted.toFixed(decimalPlaces, format, rounding);
  };

  _createClass(Price, [{
    key: "raw",
    get: function get() {
      return new Fraction(this.numerator, this.denominator);
    }
  }, {
    key: "adjusted",
    get: function get() {
      return _Fraction.prototype.multiply.call(this, this.scalar);
    }
  }]);

  return Price;
}(Fraction);

var Route = /*#__PURE__*/function () {
  function Route(pairs, input) {
    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !pairs.map(function (pair) {
      return pair.token0.chainId === pairs[0].token0.chainId;
    }).every(function (x) {
      return x;
    }) ?  invariant(false, 'CHAIN_IDS')  : void 0;
    var path = [input];

    for (var _iterator = _createForOfIteratorHelperLoose(pairs.entries()), _step; !(_step = _iterator()).done;) {
      var _step$value = _step.value,
          i = _step$value[0],
          pair = _step$value[1];
      var currentInput = path[i];
      !(currentInput.equals(pair.token0) || currentInput.equals(pair.token1)) ?  invariant(false, 'PATH')  : void 0;
      var output = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
      path.push(output);
    }

    !(path.length === new Set(path).size) ?  invariant(false, 'PATH')  : void 0;
    this.pairs = pairs;
    this.path = path;
    this.midPrice = Price.fromRoute(this);
  }

  _createClass(Route, [{
    key: "input",
    get: function get() {
      return this.path[0];
    }
  }, {
    key: "output",
    get: function get() {
      return this.path[this.path.length - 1];
    }
  }]);

  return Route;
}();

var _100_PERCENT = /*#__PURE__*/new Fraction(_100);

var Percent = /*#__PURE__*/function (_Fraction) {
  _inheritsLoose(Percent, _Fraction);

  function Percent() {
    return _Fraction.apply(this, arguments) || this;
  }

  var _proto = Percent.prototype;

  _proto.toSignificant = function toSignificant(significantDigits, format, rounding) {
    if (significantDigits === void 0) {
      significantDigits = 5;
    }

    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding);
  };

  _proto.toFixed = function toFixed(decimalPlaces, format, rounding) {
    if (decimalPlaces === void 0) {
      decimalPlaces = 2;
    }

    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding);
  };

  return Percent;
}(Fraction);

function getSlippage(midPrice, inputAmount, outputAmount) {
  var exactQuote = midPrice.raw.multiply(inputAmount.raw); // calculate slippage := (exactQuote - outputAmount) / exactQuote

  var slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
} // comparator function that allows sorting trades by their output amounts, in decreasing order, and then input amounts
// in increasing order. i.e. the best trades have the most outputs for the least inputs and are sorted first


function inputOutputComparator(a, b) {
  // must have same input and output token for comparison
  !a.inputAmount.token.equals(b.inputAmount.token) ?  invariant(false, 'INPUT_TOKEN')  : void 0;
  !a.outputAmount.token.equals(b.outputAmount.token) ?  invariant(false, 'OUTPUT_TOKEN')  : void 0;

  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    } // trade A requires less input than trade B, so A should come first


    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    // tradeA has less output than trade B, so should come second
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
} // extension of the input output comparator that also considers other dimensions of the trade in ranking them

function tradeComparator(a, b) {
  var ioComp = inputOutputComparator(a, b);

  if (ioComp !== 0) {
    return ioComp;
  } // consider lowest slippage next, since these are less likely to fail


  if (a.slippage.lessThan(b.slippage)) {
    return -1;
  } else if (a.slippage.greaterThan(b.slippage)) {
    return 1;
  } // finally consider the number of hops since each hop costs gas


  return a.route.path.length - b.route.path.length;
}
var Trade = /*#__PURE__*/function () {
  function Trade(route, amount, tradeType) {
    !amount.token.equals(tradeType === exports.TradeType.EXACT_INPUT ? route.input : route.output) ?  invariant(false, 'TOKEN')  : void 0;
    var amounts = new Array(route.path.length);
    var nextPairs = new Array(route.pairs.length);

    if (tradeType === exports.TradeType.EXACT_INPUT) {
      amounts[0] = amount;

      for (var i = 0; i < route.path.length - 1; i++) {
        var pair = route.pairs[i];

        var _pair$getOutputAmount = pair.getOutputAmount(amounts[i]),
            _outputAmount = _pair$getOutputAmount[0],
            nextPair = _pair$getOutputAmount[1];

        amounts[i + 1] = _outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      amounts[amounts.length - 1] = amount;

      for (var _i = route.path.length - 1; _i > 0; _i--) {
        var _pair = route.pairs[_i - 1];

        var _pair$getInputAmount = _pair.getInputAmount(amounts[_i]),
            _inputAmount = _pair$getInputAmount[0],
            _nextPair = _pair$getInputAmount[1];

        amounts[_i - 1] = _inputAmount;
        nextPairs[_i - 1] = _nextPair;
      }
    }

    this.route = route;
    this.tradeType = tradeType;
    var inputAmount = amounts[0];
    var outputAmount = amounts[amounts.length - 1];
    this.inputAmount = inputAmount;
    this.outputAmount = outputAmount;
    this.executionPrice = new Price(route.input, route.output, inputAmount.raw, outputAmount.raw);
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input));
    this.slippage = getSlippage(route.midPrice, inputAmount, outputAmount);
  } // get the minimum amount that must be received from this trade for the given slippage tolerance


  var _proto = Trade.prototype;

  _proto.minimumAmountOut = function minimumAmountOut(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_OUTPUT) {
      return this.outputAmount;
    } else {
      return new TokenAmount(this.outputAmount.token, new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient);
    }
  } // get the maximum amount in that can be spent via this trade for the given slippage tolerance
  ;

  _proto.maximumAmountIn = function maximumAmountIn(slippageTolerance) {
    !!slippageTolerance.lessThan(ZERO) ?  invariant(false, 'SLIPPAGE_TOLERANCE')  : void 0;

    if (this.tradeType === exports.TradeType.EXACT_INPUT) {
      return this.inputAmount;
    } else {
      return new TokenAmount(this.inputAmount.token, new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient);
    }
  } // given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
  // amount to an output token, making at most `maxHops` hops
  // note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
  // the amount in among multiple routes.
  ;

  Trade.bestTradeExactIn = function bestTradeExactIn(pairs, amountIn, tokenOut, _temp, // used in recursion.
  currentPairs, originalAmountIn, bestTrades) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$maxNumResults = _ref.maxNumResults,
        maxNumResults = _ref$maxNumResults === void 0 ? 3 : _ref$maxNumResults,
        _ref$maxHops = _ref.maxHops,
        maxHops = _ref$maxHops === void 0 ? 3 : _ref$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountIn === void 0) {
      originalAmountIn = amountIn;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountIn === amountIn || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;

      var _amountOut = void 0;

      try {
        ;

        var _pair$getOutputAmount2 = pair.getOutputAmount(amountIn);

        _amountOut = _pair$getOutputAmount2[0];
      } catch (error) {
        // input too low
        if (error.isInsufficientInputAmountError) {
          continue;
        }

        throw error;
      } // we have arrived at the output token, so this is the final trade of one of the paths


      if (_amountOut.token.equals(tokenOut)) {
        sortedInsert(bestTrades, new Trade(new Route([].concat(currentPairs, [pair]), originalAmountIn.token), originalAmountIn, exports.TradeType.EXACT_INPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that lead from this token as long as we have not exceeded maxHops

        Trade.bestTradeExactIn(pairsExcludingThisPair, _amountOut, tokenOut, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [].concat(currentPairs, [pair]), originalAmountIn, bestTrades);
      }
    }

    return bestTrades;
  } // similar to the above method but instead targets a fixed output amount
  // given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
  // to an output token amount, making at most `maxHops` hops
  // note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
  // the amount in among multiple routes.
  ;

  Trade.bestTradeExactOut = function bestTradeExactOut(pairs, tokenIn, amountOut, _temp2, // used in recursion.
  currentPairs, originalAmountOut, bestTrades) {
    var _ref2 = _temp2 === void 0 ? {} : _temp2,
        _ref2$maxNumResults = _ref2.maxNumResults,
        maxNumResults = _ref2$maxNumResults === void 0 ? 3 : _ref2$maxNumResults,
        _ref2$maxHops = _ref2.maxHops,
        maxHops = _ref2$maxHops === void 0 ? 3 : _ref2$maxHops;

    if (currentPairs === void 0) {
      currentPairs = [];
    }

    if (originalAmountOut === void 0) {
      originalAmountOut = amountOut;
    }

    if (bestTrades === void 0) {
      bestTrades = [];
    }

    !(pairs.length > 0) ?  invariant(false, 'PAIRS')  : void 0;
    !(maxHops > 0) ?  invariant(false, 'MAX_HOPS')  : void 0;
    !(originalAmountOut === amountOut || currentPairs.length > 0) ?  invariant(false, 'INVALID_RECURSION')  : void 0;

    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i]; // pair irrelevant

      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token)) continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO)) continue;

      var _amountIn = void 0;

      try {
        ;

        var _pair$getInputAmount2 = pair.getInputAmount(amountOut);

        _amountIn = _pair$getInputAmount2[0];
      } catch (error) {
        // not enough liquidity in this pair
        if (error.isInsufficientReservesError) {
          continue;
        }

        throw error;
      } // we have arrived at the input token, so this is the first trade of one of the paths


      if (_amountIn.token.equals(tokenIn)) {
        sortedInsert(bestTrades, new Trade(new Route([pair].concat(currentPairs), tokenIn), originalAmountOut, exports.TradeType.EXACT_OUTPUT), maxNumResults, tradeComparator);
      } else if (maxHops > 1 && pairs.length > 1) {
        var pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length)); // otherwise, consider all the other paths that arrive at this token as long as we have not exceeded maxHops

        Trade.bestTradeExactOut(pairsExcludingThisPair, tokenIn, _amountIn, {
          maxNumResults: maxNumResults,
          maxHops: maxHops - 1
        }, [pair].concat(currentPairs), originalAmountOut, bestTrades);
      }
    }

    return bestTrades;
  };

  return Trade;
}();

exports.JSBI = JSBI;
exports.FACTORY_ADDRESS = FACTORY_ADDRESS;
exports.Fraction = Fraction;
exports.INIT_CODE_HASH = INIT_CODE_HASH;
exports.InsufficientInputAmountError = InsufficientInputAmountError;
exports.InsufficientReservesError = InsufficientReservesError;
exports.MINIMUM_LIQUIDITY = MINIMUM_LIQUIDITY;
exports.Pair = Pair;
exports.Percent = Percent;
exports.Price = Price;
exports.Route = Route;
exports.Token = Token;
exports.TokenAmount = TokenAmount;
exports.Trade = Trade;
exports.VVET = VVET;
exports.inputOutputComparator = inputOutputComparator;
exports.tradeComparator = tradeComparator;
//# sourceMappingURL=sdk.cjs.development.js.map
