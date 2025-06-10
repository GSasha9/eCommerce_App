export enum ErrorMessage {
  MISSING_CONFIG = 'Missing required config for Commercetools',
  MISSING_PROJECT_KEY = 'Missing required project key for Commercetools',
  MISSING_ENV_VARS = 'Missing required env variables for Commercetools client',
  BUTTON_CREATOR_INVALID = 'ButtonCreator must create an HTMLButtonElement',
  INPUT_CREATOR_INVALID = 'InputCreator must create an HTMLInputElement',
  UNABLE_TO_GET_INFO_PRODUCT = 'Unable to retrieve information about all products:',
  UNABLE_TO_GET_PRODUCT_BY_CATEGORY = 'Failed to fetch products by category:',
  UNABLE_TO_GET_DISCOUNT_INFORMATION = 'Unable to retrieve detailed information about the product discount:',
  FAILED_TO_RESTORE_SESSION = 'Failed to parse credentials or restore session:',
  RE_AUTHENTICATION_FAILED = 'Re-authentication failed:',
  LOGIN_FAILED = 'Login failed: Invalid credentials or expired session. Please try again.',
}
