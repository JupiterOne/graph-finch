import { accountSteps } from './account';
import { userSteps } from './users';
import { relationshipSteps } from './relationships';

// TODO (adam-in-ict) We don't have access to the configuration here, so trying to
// convert this to a function will cause issues when the invocationConfig expects
// this to just be a static list of steps. Hardcoding for now.
const integrationSteps = [
  ...accountSteps('finch'),
  ...userSteps('finch'),
  ...relationshipSteps('finch'),
];

export { integrationSteps };
