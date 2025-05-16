import { ErrorModal } from '../../components/modals/error-modal.ts';
import type { CommercetoolsApiError } from '../../shared/models/type';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

export const handleApiError = (error: CommercetoolsApiError): void => {
  if (isCommercetoolsApiError(error)) {
    const statusCode = error.body.statusCode;
    const code = error.body.errors[0].code;

    if (statusCode === 400) {
      switch (code) {
        case 'InvalidJsonInput':
          new ErrorModal('Invalid input data. Please check the form and try again.').open();

          break;
        case 'InvalidQueryParam':
          new ErrorModal('Invalid query parameter provided.').open();

          break;
        case 'InvalidPathParam':
          new ErrorModal('Invalid path parameter.').open();

          break;
        case 'DuplicateField':
          new ErrorModal('A user with this email already exists.').open();

          break;
        case 'FieldValueNotFound':
          new ErrorModal('A required field is missing.').open();

          break;
        case 'GitRepositoryNotReachableError':
          new ErrorModal('Git repository could not be reached.').open();

          break;
        default:
          new ErrorModal(error.body.errors[0].message || 'Bad request. Please try again.').open();
      }
    }

    if (statusCode === 401) {
      switch (code) {
        case 'InvalidCredentials':
          new ErrorModal('Incorrect email or password. Please try again.').open();

          break;
        default:
          new ErrorModal(error.body.errors[0].message || 'Unauthorized access.').open();
      }
    }
  } else {
    new ErrorModal('An unexpected error occurred. Please try again later.').open();
  }
};
