import { accountSteps } from './account';
import { userSteps } from './users';

// TODO (adam-in-ict) We don't have access to the configuration here, so even trying
// to convert this to a function will cause issues when the invocationConfig expects
// this to just be a static list of steps.
const integrationSteps = [...accountSteps('finch'), ...userSteps('finch')];

export { integrationSteps };
