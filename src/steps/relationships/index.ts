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

export async function buildUserToUserRelationship({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const provider = instance.config.provider;

  await jobState.iterateEntities(
    { _type: Entities(provider).USER._type },
    async (userEntity) => {
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

export async function buildAccountToUserRelationship({
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
    },
  );
}

export function relationshipSteps(
  provider: string,
): IntegrationStep<IntegrationConfig>[] {
  return [
    {
      id: Steps.BUILD_USER_TO_USER_RELATIONSHIP,
      name: 'Build User to User Relationship',
      entities: [],
      relationships: [Relationships(provider).USER_MANAGES_USER],
      dependsOn: [Steps.USERS],
      executionHandler: buildUserToUserRelationship,
    },
    {
      id: Steps.BUILD_ACCOUNT_TO_USER_RELATIONSHIP,
      name: 'Build Account to User Relationship',
      entities: [],
      relationships: [Relationships(provider).ACCOUNT_HAS_USER],
      dependsOn: [Steps.ACCOUNT, Steps.USERS],
      executionHandler: buildAccountToUserRelationship,
    },
  ];
}
