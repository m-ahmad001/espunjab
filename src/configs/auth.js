export default {
  meEndpoint: '/api/users/me',
  loginEndpoint: '/api/users/login',
  registerEndpoint: '/api/users/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
