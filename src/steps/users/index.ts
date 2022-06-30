import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createUserEntity } from './converter';

export async function fetchUserDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config);
  const provider = instance.config.provider;

  await client.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user, provider);
    await jobState.addEntity(userEntity);
  });
}

export function userSteps(
  provider: string,
): IntegrationStep<IntegrationConfig>[] {
  return [
    {
      id: Steps.USERS,
      name: 'Fetch User Details',
      entities: [Entities(provider).USER],
      relationships: [],
      dependsOn: [],
      executionHandler: fetchUserDetails,
    },
  ];
}
