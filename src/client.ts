import { IntegrationConfig } from './config';
import { GaxiosOptions, request } from 'gaxios';
import { DirectoryResponse, DirectoryUser, Account } from './types';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  private BASE_URL = 'https://api.tryfinch.com';
  private headers = {
    'Finch-API-Version': '2020-09-17',
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + this.config.accessToken,
  };

  constructor(readonly config: IntegrationConfig) {}

  public async verifyAuthentication(): Promise<void> {
    const requestOpts: GaxiosOptions = {
      url: this.BASE_URL + '/employer/directory?limit=1',
      method: 'GET',
      headers: this.headers,
    };
    const response = await request<DirectoryResponse>(requestOpts);

    if (response.status === 200) {
      return;
    } else if (response.status === 401) {
      throw new IntegrationProviderAuthorizationError({
        endpoint: response.config.url as string,
        status: 401,
        statusText: 'Unauthorized',
      });
    } else {
      throw new IntegrationProviderAPIError({
        endpoint: response.config.url as string,
        status: response.status,
        statusText: response.statusText,
      });
    }
  }

  /**
   * Queries and generates Account entity.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async getAccount(
    converter: (account: Account) => Promise<void> | void,
  ): Promise<void> {
    const requestOpts: GaxiosOptions = {
      url: this.BASE_URL + '/employer/company',
      method: 'GET',
      headers: this.headers,
    };
    const response = await request<Account>(requestOpts);
    await converter(response.data);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<DirectoryUser>,
  ): Promise<void> {
    const requestOpts: GaxiosOptions = {
      url: this.BASE_URL + '/employer/directory',
      method: 'GET',
      headers: this.headers,
    };
    const response = await request<DirectoryResponse>(requestOpts);

    for (const user of response.data.individuals) {
      await iteratee(user);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
