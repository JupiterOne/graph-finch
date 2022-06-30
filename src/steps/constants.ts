import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNT: 'fetch-account',
  USERS: 'fetch-users',
  RELATIONSHIPS: 'fetch-relationships',
};

export function Entities(
  provider: string,
): Record<'ACCOUNT' | 'USER', StepEntityMetadata> {
  return {
    ACCOUNT: {
      resourceName: 'Account',
      //TODO (adam-in-ict) is this how we want to handle types in Finch
      // integrations?  This assumes we'll prepend the provider config
      // value to each _type.
      _type: provider + '_account',
      _class: ['Account'],
      schema: {
        properties: {
          name: { type: 'string' },
        },
      },
    },
    USER: {
      resourceName: 'User',
      _type: provider + '_user',
      _class: ['User'],
      schema: {
        properties: {
          username: { type: 'string' },
          active: { type: 'boolean' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          middleName: { type: ['string', 'null'] },
          name: { type: 'string' },
        },
        required: ['username', 'active', 'firstName', 'name'],
      },
    },
  };
}

export function Relationships(
  provider: string,
): Record<'ACCOUNT_HAS_USER' | 'USER_MANAGES_USER', StepRelationshipMetadata> {
  return {
    ACCOUNT_HAS_USER: {
      _type: provider + '_account_has_user',
      sourceType: Entities(provider).ACCOUNT._type,
      _class: RelationshipClass.HAS,
      targetType: Entities(provider).USER._type,
    },
    USER_MANAGES_USER: {
      _type: provider + '_user_manages_user',
      sourceType: Entities(provider).ACCOUNT._type,
      _class: RelationshipClass.MANAGES,
      targetType: Entities(provider).USER._type,
    },
  };
}
