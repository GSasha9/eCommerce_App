import type { AuthState } from '../types';

type env = {
  clientId: string;
  clientSecret: string;
  projectKey: string;
  authUrl: string;
};

export const getAccessToken = async (
  auth: AuthState,
  { clientId, clientSecret, projectKey, authUrl }: env,
): Promise<string | undefined> => {
  const basicAuth = btoa(`${clientId}:${clientSecret}`);

  const scope = encodeURIComponent(
    `manage_my_profile:${projectKey} manage_my_orders:${projectKey} view_published_products:${projectKey} manage_customers:${projectKey}`,
  );

  const body =
    auth.type === 'authenticated'
      ? `grant_type=password&username=${encodeURIComponent(auth.email)}&password=${encodeURIComponent(auth.password)}&scope=${scope}`
      : `grant_type=client_credentials&scope=manage_my_profile:${projectKey}`;

  const url =
    auth.type === 'authenticated'
      ? `${authUrl}/oauth/${projectKey}/customers/token` // Правильный URL для Password Flow
      : `${authUrl}/oauth/token`; // URL для Client Credentials Flow

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(`Failed to fetch token: ${error}`);
  }

  const data: unknown = await response.json();

  if (data && typeof data === 'object' && 'access_token' in data && typeof data.access_token === 'string') {
    const accessToken = data.access_token;

    if (auth.type === 'anonymous') {
      localStorage.setItem('pl_anonymousAccessToken', accessToken);
    }

    return accessToken;
  } else {
    console.error('Invalid token response:', data);
  }
};
