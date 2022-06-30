import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { DirectoryUser } from '../../types';
import { Entities } from '../constants';

export function createUserKey(userId: string, provider: string) {
  return provider + '_user:' + userId;
}

export function createUserEntity(
  user: DirectoryUser,
  provider: string,
): Entity {
  const generatedUsername = user.first_name + user.middle_name + user.last_name;
  const generatedFullName =
    user.first_name +
    ' ' +
    (user.middle_name ? user.middle_name + ' ' : '') +
    user.last_name;
  return createIntegrationEntity({
    entityData: {
      source: {
        ...user,
        notes: undefined,
      },
      assign: {
        _key: createUserKey(user.id!, provider),
        _class: Entities(provider).USER._class,
        _type: Entities(provider).USER._type,
        username: generatedUsername,
        name: generatedFullName,
        displayName: generatedFullName,
        firstName: user.first_name,
        lastName: user.last_name,
        middleName: user.middle_name,
        active: user.is_active,
      },
    },
  });
}

export function createManagerToUserRelationship(
  manager: Entity,
  employee: Entity,
) {
  return createDirectRelationship({
    _class: RelationshipClass.MANAGES,
    from: manager,
    to: employee,
  });
}

export function createAccountToUserRelationship(
  account: Entity,
  employee: Entity,
) {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: employee,
  });
}
