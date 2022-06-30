import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createAccountEntity } from './converter';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccountDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config);
  await client.getAccount(async (account) => {
    const accountEntity = await jobState.addEntity(
      createAccountEntity(account, instance.config.provider),
    );
    await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
  });
}

export function accountSteps(
  provider: string,
): IntegrationStep<IntegrationConfig>[] {
  return [
    {
      id: Steps.ACCOUNT,
      name: 'Fetch Account Details',
      entities: [Entities(provider).ACCOUNT],
      relationships: [],
      dependsOn: [],
      executionHandler: fetchAccountDetails,
    },
  ];
}
