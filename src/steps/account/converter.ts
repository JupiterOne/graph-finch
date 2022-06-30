import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Account } from '../../types';

import { Entities } from '../constants';

export function createAccountEntity(
  account: Account,
  provider: string,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: account.id,
        name: account.legal_name,
      },
      assign: {
        _key: account.id,
        name: account.legal_name,
        displayName: account.legal_name,
        _type: Entities(provider).ACCOUNT._type,
        _class: Entities(provider).ACCOUNT._class,
      },
    },
  });
}
