import './polyfills';

import { ExtendedContract } from '../src/extended-contract';
import { Web3 } from 'web3';

import {
  testSuccessfulCompilation,
  testCompilationCauseError,
  testDeploymentAndCalls,
  testSuccessfulCompilationFromFile,
} from './extended-contract-test-helpers';

describe('ExtendedContract', () => {
  let web3: Web3;
  let ExtendedContractType: typeof ExtendedContract;
  beforeAll(async () => {
    web3 = new Web3('http://localhost:8545');
    ExtendedContractType = ExtendedContract;
  });

  it('compile source code', async () => {
    await testSuccessfulCompilation(ExtendedContractType);
  });

  it('compile source code from file', async () => {
    await testSuccessfulCompilationFromFile(ExtendedContractType);
  });

  it('raise error while compiling an invalid code', async () => {
    await testCompilationCauseError(ExtendedContractType);
  });

  // This test case can be unskipped if there is a node running
  it.skip('deploy contract', async () => {
    const accounts = await web3.eth.getAccounts();
    const fromAccount = accounts[0];
    await testDeploymentAndCalls(
      ExtendedContractType,
      fromAccount,
      web3.provider
    );
  });
});
