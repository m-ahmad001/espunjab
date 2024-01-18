const navigation = () => {
  return [
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'Records',
      icon: 'mdi:shield-outline'
    },
    {
      path: '/add-new',
      action: 'read',
      subject: 'acl-page',
      title: 'Add New Record',
      icon: 'mdi:shield-outline'
    }
  ]
}

export default navigation
