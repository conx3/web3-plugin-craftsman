import './polyfills';

import { Web3 } from 'web3';

import { ExtendedWeb3 } from '../src/extended-web3';

import { ExtendedContract } from '../src';
import {
  testSuccessfulCompilation,
  testCompilationCauseError,
  testDeploymentAndCalls,
  testSuccessfulCompilationFromFileOptions,
  testSuccessfulCompilationFromCodeOptions,
  testSuccessfulCompilationFromMultiFileWithOptions,
  testSaveCompilationResultFromSolidityCode,
  testSaveCompilationResultFromSolidityFile,
  itSkipIfWindows,
} from './extended-contract-test-helpers';
import { testSuccessfulCompilationFromFile } from './extended-contract-test-helpers';

describe('ExtendedWeb3 as plugin', () => {
  let web3: Web3;
  let ExtendedContractType: typeof ExtendedContract;
  beforeAll(async () => {
    web3 = new Web3('http://localhost:8545');
    web3.registerPlugin(new ExtendedWeb3());
    ExtendedContractType = web3.craftsman.ExtendedContract;
  });

  it('compile source code', async () => {
    await testSuccessfulCompilation(ExtendedContractType);
  });

  it('compile source code from options', async () => {
    await testSuccessfulCompilationFromCodeOptions(ExtendedContractType);
  });

  it('compile source code from file', async () => {
    await testSuccessfulCompilationFromFile(ExtendedContractType);
  });

  it('compile source code from file options', async () => {
    await testSuccessfulCompilationFromFileOptions(ExtendedContractType);
  });

  itSkipIfWindows(
    'compile source code from multiple files with options',
    async () => {
      await testSuccessfulCompilationFromMultiFileWithOptions(
        ExtendedContractType
      );
    }
  );

  it('raise error while compiling an invalid code', async () => {
    await testCompilationCauseError(ExtendedContractType);
  });

  it('save compilation result from solidity code', async () => {
    await testSaveCompilationResultFromSolidityCode(ExtendedContractType);
  });

  itSkipIfWindows('save compilation result from solidity file', async () => {
    await testSaveCompilationResultFromSolidityFile(ExtendedContractType);
  });

  // This test case can be unskipped if there is a node running
  it.skip('deploy contract', async () => {
    const accounts = await web3.eth.getAccounts();
    const fromAccount = accounts[0];
    await testDeploymentAndCalls(ExtendedContractType, fromAccount);
  });
});
