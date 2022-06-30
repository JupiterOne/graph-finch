import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { DirectoryUser } from '../../types';
import { Steps, Entities, Relationships } from '../constants';
import {
  createUserEntity,
  createManagerToUserRelationship,
  createAccountToUserRelationship,
} from './converter';
import { ACCOUNT_ENTITY_KEY } from '../account';

export async function fetchUserDetails({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = createAPIClient(instance.config);
  const provider = instance.config.provider;
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  await client.iterateUsers(async (account) => {
    const userEntity = createUserEntity(account, provider);
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createAccountToUserRelationship(accountEntity, userEntity),
    );
  });

  // const accountEntity = await jobState.findEntity()
  await jobState.iterateEntities(
    { _type: Entities(provider).USER._type },
    async (userEntity) => {
      const userData = getRawData<DirectoryUser>(userEntity);
      const managerEntity = await jobState.findEntity(
        provider + '_user:' + userData?.manager?.id,
      );
      if (managerEntity) {
        await jobState.addRelationship(
          createManagerToUserRelationship(managerEntity, userEntity),
        );
      }
    },
  );
}

export function userSteps(
  provider: string,
): IntegrationStep<IntegrationConfig>[] {
  return [
    {
      id: Steps.USERS,
      name: 'Fetch User Details',
      entities: [Entities(provider).USER],
      relationships: [
        Relationships(provider).ACCOUNT_HAS_USER,
        Relationships(provider).USER_MANAGES_USER,
      ],
      dependsOn: [Steps.ACCOUNT],
      executionHandler: fetchUserDetails,
    },
  ];
}
