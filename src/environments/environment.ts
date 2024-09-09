const baseUrl = 'https://qc.ole5dev.space/mjalisweb';

export const environment = {
  baseUrl: 'https://qc.ole5dev.space/',
  BROWSER_STORAGE_KEY: '1234',
  oAuthConfig: {
    issuer: 'https://idp.ole5dev.space',
    redirectUri: baseUrl + '/auth/login',
    postLogoutRedirectUri: baseUrl,
    clientId: 'MjalisWeb',
    responseType: 'code id_token',
    scope: 'offline_access openid profile OLE5 Mjalis',
    requireHttps: true,
    useSilentRefresh: true,
    tokenEndpoint: 'https://idp.ole5dev.space/connect/token',
    logoutUrl: 'https://idp.ole5dev.space/connect/endsession',
  },
};
