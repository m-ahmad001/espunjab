const navigation = () => {
  return [
    {
      path: '/add-new',
      action: 'read',
      subject: 'acl-page',
      title: 'Add New Record',
      icon: 'mdi:shield-outline'
    },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Records',
      icon: 'mdi:shield-outline'
    },
    {
      title: 'Update Password',
      icon: 'mdi:lock-reset',
      path: '/update-password',
      action: 'read',
      subject: 'acl-page',
    }
  ]
}

export default navigation
