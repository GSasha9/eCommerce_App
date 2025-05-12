import './styles/style.css';
import { App } from './app/main.ts';
//import { returnCustomerByEmail } from './shared/utils/api-definition.ts';

new App();

// returnCustomerByEmail('sdk@example.com')
//   .then(({ body }) => {
//     if (body.results.length == 0) {
//       console.log('This email address has not been registered.');
//     } else {
//       console.log(body.results[0]);
//     }
//   })
//   .catch(console.error);

//   createCustomer('test@example.com', '123456') .then(({ body }) => {
//     console.log(body);
//   })
//   .catch(console.error);
