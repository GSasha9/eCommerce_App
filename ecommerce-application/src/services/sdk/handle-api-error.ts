import { ModalMessage } from '../../components/modals/modal-message.ts';
import type { CommercetoolsApiError } from '../../shared/models/type';
import { isCommercetoolsApiError } from '../../shared/models/typeguards.ts';

export const handleApiError = (error: CommercetoolsApiError): void => {
  if (isCommercetoolsApiError(error)) {
    const statusCode = error.body.statusCode;
    const code = error.body.errors[0].code;

    if (statusCode === 400) {
      switch (code) {
        case 'InvalidCredentials':
          void new ModalMessage('Incorrect email or password. Please try again.', 'error').open();

          break;
        case 'InvalidJsonInput':
          void new ModalMessage('Invalid input data. Please check the form and try again.', 'error').open();
          console.log(error.body.errors[0].message);

          break;
        case 'InvalidQueryParam':
          void new ModalMessage('Invalid query parameter provided.', 'error').open();

          break;
        case 'InvalidPathParam':
          void new ModalMessage('Invalid path parameter.', 'error').open();

          break;
        case 'DuplicateField':
          void new ModalMessage('A user with this email already exists.', 'error').open();

          break;
        case 'FieldValueNotFound':
          void new ModalMessage('A required field is missing.', 'error').open();

          break;
        case 'GitRepositoryNotReachableError':
          void new ModalMessage('Git repository could not be reached.', 'error').open();

          break;
        default:
          void new ModalMessage(error.body.errors[0].message || 'Bad request. Please try again.', 'error').open();
          console.log('error.body---', error.body);
      }
    }

    if (statusCode === 401) {
      switch (code) {
        case 'InvalidCredentials':
          void new ModalMessage('Incorrect email or password. Please try again.', 'error').open();

          break;
        default:
          void new ModalMessage(error.body.errors[0].message || 'Unauthorized access.', 'error').open();
      }
    }
  } else {
    void new ModalMessage('An unexpected error occurred. Please try again later.', 'error').open();
  }
};
