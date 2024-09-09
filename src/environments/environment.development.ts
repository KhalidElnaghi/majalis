// const webUrl = 'http://localhost:4200';
const webUrl = 'https://localhost:4200';

export const environment = {
  BROWSER_STORAGE_KEY: '1234',
  baseUrl: 'https://qc.ole5dev.space/',
  oAuthConfig: {
    issuer: 'https://idp.ole5dev.space',
    redirectUri: webUrl + '/auth/login',
    postLogoutRedirectUri: webUrl,
    clientId: 'MjalisWeb',
    responseType: 'code id_token',
    scope: 'offline_access openid profile OLE5 Mjalis',
    requireHttps: true,
    useSilentRefresh: true,
    tokenEndpoint: 'https://idp.ole5dev.space/connect/token',
    logoutUrl: 'https://idp.ole5dev.space/connect/endsession',
  },
};
