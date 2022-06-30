import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  getRawData,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../config';
import { DirectoryUser } from '../../types';
import { Steps, Entities, Relationships } from '../constants';
import {
  createManagerToUserRelationship,
  createAccountToUserRelationship,
  createUserKey,
} from './converter';
import { ACCOUNT_ENTITY_KEY } from '../account';

export async function fetchRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const provider = instance.config.provider;
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await jobState.iterateEntities(
    { _type: Entities(provider).USER._type },
    async (userEntity) => {
      await jobState.addRelationship(
        createAccountToUserRelationship(accountEntity, userEntity),
      );
      const userData = getRawData<DirectoryUser>(userEntity);
      const managerEntity = await jobState.findEntity(
        createUserKey(userData?.manager?.id || '', provider),
      );
      if (managerEntity) {
        await jobState.addRelationship(
          createManagerToUserRelationship(managerEntity, userEntity),
        );
      }
    },
  );
}

export function relationshipSteps(
  provider: string,
): IntegrationStep<IntegrationConfig>[] {
  return [
    {
      id: Steps.RELATIONSHIPS,
      name: 'Fetch Relationships',
      entities: [],
      relationships: [
        Relationships(provider).ACCOUNT_HAS_USER,
        Relationships(provider).USER_MANAGES_USER,
      ],
      dependsOn: [Steps.ACCOUNT, Steps.USERS],
      executionHandler: fetchRelationships,
    },
  ];
}
