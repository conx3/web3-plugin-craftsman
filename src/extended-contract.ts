import {
  Address,
  Contract,
  ContractAbi,
  ContractInitOptions,
  DataFormat,
  Web3Context,
  eth,
} from 'web3';
import { AbiAndBytecode, SolidityCompiler } from './solidity-compiler';

export class ExtendedContract<Abi extends ContractAbi> extends Contract<Abi> {
  public hadFinishedCompilation?: boolean;
  public compilationResult?: Promise<AbiAndBytecode>;

  /**
   * Creates a new contract instance with all its methods and events defined in its json interface object.
   *
   * ```ts
   * new web3.eth.Contract(jsonInterface[, address][, options])
   * ```
   *
   * @param sourceCodeOrAbi - The plane source code of the Smart Contract or its JSON interface (ABI).
   * @param address - The address of the smart contract to call.
   * @param options - The options of the contract. Some are used as fallbacks for calls and transactions.
   * @param context - The context of the contract used for customizing the behavior of the contract.
   * @returns - The contract instance with all its methods and events.
   *
   * ```ts title="Example"
   * var myContract = new web3.eth.Contract(
   *  '
   *  pragma solidity ^0.8.0;
   *  contract MyContract {
   *      uint256 public myNumber;
   *      constructor(uint256 _myNumber) {
   *          myNumber = _myNumber;
   *      }
   *      function setMyNumber(uint256 _myNumber) public {
   *          myNumber = _myNumber;
   *      }
   *  }
   *  ',
   *  '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
   *  {
   *   from: '0x1234567890123456789012345678901234567891', // default from address
   *   gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
   *  });
   * ```
   *
   * To use the type safe interface for these contracts you have to include the ABI definitions in your Typescript project and then declare these as `const`.
   *
   * ```ts title="Example"
   * const myContractAbi = [....] as const; // ABI definitions
   * const myContract = new web3.eth.Contract(myContractAbi, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe');
   * ```
   */
  constructor(
    jsonInterface: Abi,
    context?: eth.contract.Web3ContractContext | Web3Context,
    returnFormat?: DataFormat
  );
  constructor(
    jsonInterface: Abi,
    address?: Address,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );
  constructor(
    jsonInterface: Abi,
    options?: ContractInitOptions,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );
  constructor(
    jsonInterface: Abi,
    address: Address | undefined,
    options: ContractInitOptions,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );

  constructor(
    sourceCode: string,
    context?: eth.contract.Web3ContractContext | Web3Context,
    returnFormat?: DataFormat
  );
  constructor(
    sourceCode: string,
    address?: Address,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );
  constructor(
    sourceCode: string,
    options?: ContractInitOptions,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );
  constructor(
    sourceCode: string,
    address: Address | undefined,
    options: ContractInitOptions,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  );

  public constructor(
    sourceCodeOrAbi: string | Abi,
    addressOrOptionsOrContext?:
      | Address
      | ContractInitOptions
      | eth.contract.Web3ContractContext
      | Web3Context,
    optionsOrContextOrReturnFormat?:
      | ContractInitOptions
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    contextOrReturnFormat?:
      | eth.contract.Web3ContractContext
      | Web3Context
      | DataFormat,
    returnFormat?: DataFormat
  ) {
    if (typeof sourceCodeOrAbi === 'string') {
      super(
        [] as any,
        addressOrOptionsOrContext as any,
        optionsOrContextOrReturnFormat as any,
        contextOrReturnFormat,
        returnFormat
      );
      this.hadFinishedCompilation = false;
      this.compilationResult = new Promise((resolve, reject) => {
        const anyName = 'contract';
        SolidityCompiler.compileSourceString(anyName, sourceCodeOrAbi)
          .then(compilationRes => {
            if (compilationRes.abi && compilationRes.bytecodeString) {
              // Ignore the typescript error: "Property 'jsonInterface' does not exist on type 'ContractOptions'."
              // @ts-ignore
              this.options.jsonInterface = compilationRes.abi;
              (this.options as { input: string }).input =
                compilationRes.bytecodeString;
              this.hadFinishedCompilation = true;
              resolve({
                abi: compilationRes.abi,
                bytecodeString: compilationRes.bytecodeString,
              });
            } else {
              this.hadFinishedCompilation = true;
              reject(
                new Error(
                  'Something when wrong. The reason could be that you have multiple smart contracts provided'
                )
              );
            }
          })
          .catch((e: Error) => {
            reject(e);
          });
      });
    } else {
      super(
        sourceCodeOrAbi,
        addressOrOptionsOrContext as any,
        optionsOrContextOrReturnFormat as any,
        contextOrReturnFormat,
        returnFormat
      );

      this.compilationResult = new Promise((_, reject) => {
        reject(
          new Error(
            'You are not supposed to call `compilationResult()` because no source code was provided.'
          )
        );
      });
    }
  }
}