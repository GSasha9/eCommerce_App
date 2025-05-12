import { emailValidation } from './email-validation';
import { passwordValidation } from './password-validation';
import { getAccessToken } from '../../../shared/utils/api-definition';
//import { apiDefinition } from '../../../shared/utils/api-definition';

export const formValidation = async (email: HTMLInputElement, password: HTMLInputElement): Promise<void> => {
  if (!emailValidation(email) || !passwordValidation(password)) {
    return;
  } else {
    const user = {
      email: email.value,
      password: password.value,
    };

    console.log(user);

    try {
      const token = await getAccessToken({
        type: 'authenticated',
        email: user.email,
        password: user.password,
      });

      console.log('Login successful. Token:', token);

      // можно сохранить токен и использовать его
      if (token) localStorage.setItem('access_token', token);
    } catch (error) {
      console.error('Login failed:', error);
    }

    // а это если бы я регистрировала через свою форму

    /*

    try {
      const anonymusToken = await getAccessToken({ type: 'anonymous' });

      console.log(anonymusToken);

      const api = apiDefinition({ type: 'anonymous' });

      const response = await api
        .customers()
        .post({
          body: {
            email: user.email,
            password: user.password,
          },
        })
        .execute();

      console.log('Customer created:', response.body);

      //   // optionally: login and get token
      //   const token = await getAccessToken({ type: 'authenticated', email: user.email, password: user.password });

      //   console.log('User token:', token);
    } catch (error) {
      console.error('Registration failed:', error);
    }*/
  }
};
