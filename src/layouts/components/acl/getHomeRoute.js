/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'client') return '/dashboard'
  else return '/admin_deposits_requests'
}

export default getHomeRoute
