import supabase from 'src/configs/supabase'

// demoApi.js
async function waitFor12Seconds() {
  console.log('Waiting for 12 seconds...')

  // Wrap the setTimeout in a Promise to use async/await
  await new Promise(resolve => setTimeout(resolve, 12000))

  console.log('12 seconds have passed. Continuing to the next step.')

  // You can add your next steps here
}

export default async function handler(req, res) {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Set the time to the beginning of the day

  console.log('🚀 ~ handler ~ today.toISOString():', today.toISOString())

  const specificEmails = [
    'uzairhussain840@gmail.com',
    'irfan794@yahoo.com',
    'jamilahmeddaniyalahmed@gmail.com',
    'hammadsoomro31@gmail.com'
  ]

  // Step 1: Fetch logs based on specific conditions
  const { data: logs, error: logsError } = await supabase
    .from('logs')
    .select('*')
    .gte('created_at', today.toISOString())
    .lte('created_at', new Date().toISOString())
    .eq('type', 'daily profit')

  if (logsError) {
    console.error('Error fetching logs:', logsError)

    // Handle the error
  } else {
    // Extract user_ids from the fetched logs
    const userIds = logs.map(log => log.user_id)

    // Step 2: Fetch users based on user_ids
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, balance, email')
      .in('id', userIds)

    if (usersError) {
      console.error('Error fetching users:', usersError)

      // Handle the error
    } else {
      // Combine logs and users based on user_id
      const logsWithUsers = logs.map(log => ({
        ...log,
        user: users.find(user => user.id === log.user_id)
      }))

      console.log('Logs with user details for specific emails:', logsWithUsers)

      return res.status(200).json({ logsWithUsers })

      // Process the combined data as needed
    }
  }

  res.status(200).json({})
}
