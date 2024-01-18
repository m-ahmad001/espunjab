const navigation = () => {
  return [
    {
      action: 'read',
      subject: 'acl-page',
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'flat-color-icons:home'
    },

    {
      action: 'read',
      subject: 'acl-page',
      title: 'Plans',
      path: '/plans',
      icon: 'emojione-v1:newspaper'
    },

    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'mdi:shield-outline'
    // },
    {
      action: 'read',
      subject: 'acl-page',
      title: 'Withdraw',
      path: '/widthdraw',
      icon: 'emojione:money-bag'
    },
    {
      action: 'read',
      subject: 'acl-page',
      title: 'Transaction History',
      path: '/history-record',
      icon: 'flat-color-icons:timeline'
    },
    {
      action: 'read',
      subject: 'acl-page',
      title: 'Teams',
      path: '/teams',
      icon: 'fluent-emoji-flat:busts-in-silhouette'
    },

    // admin
    {
      action: 'read',
      subject: 'admin',
      title: 'Deposit Request',
      path: '/admin_deposits_requests',
      icon: 'flat-color-icons:sales-performance'
    },
    {
      action: 'read',
      subject: 'admin',
      title: 'Withdraw Request',
      path: '/admin_withdraw_requests',
      icon: 'fluent-emoji-flat:chart-increasing-with-yen'
    },
    {
      action: 'read',
      subject: 'admin',
      title: 'All Users',
      path: '/admin_all_users',
      icon: 'fluent-emoji-flat:id-button'
    },
    {
      action: 'read',
      subject: 'admin',
      title: 'Logs',
      path: '/admin_all_logs',
      icon: 'flat-color-icons:data-backup'
    }
  ]
}

export default navigation
