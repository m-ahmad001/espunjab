// pages/api/statistics.js

import Cors from 'cors'

import supabase from 'src/configs/supabase'
import { runMiddleware } from 'src/utils/middleware'

const cors = Cors({
  origin: '*', // Update this to your frontend origin
  methods: ['GET', 'HEAD', 'POST', 'OPTION'] // Add the HTTP methods you need
})

export default async (req, res) => {
  await runMiddleware(req, res, cors)
  const userId = req.body.userId || req.query.userId

  try {
    // Fetch all users from Supabase
    const { data: usersData, error: usersError } = await supabase.from('users').select('*').eq('id', userId).single()

    if (usersError) {
      console.error('Error fetching users data from Supabase:', usersError.message)
      throw new Error('Error fetching users data')
    }

    // Fetch all logs from Supabase
    const { data: logsData, error: logsError } = await supabase.from('logs').select('*').eq('user_id', userId)

    if (logsError) {
      console.error('Error fetching logs data from Supabase:', logsError.message)
      throw new Error('Error fetching logs data')
    }

    // Calculate statistics based on the retrieved data
    // Initialize variables to store metrics
    let totalEarnings = 0
    let todayEarnings = 0
    let totalInvestment = 0
    let totalWithdrawals = 0
    let pendingWithdrawls = 0
    let referalEarning = 0
    let currentBalance = usersData.balance
    let totalBuyPlans = usersData?.plans?.length || 0

    // Get the current date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0]

    // Iterate through the logs to calculate metrics
    logsData.forEach((log, i) => {
      // Check the log type to determine the action
      const logDate = new Date(log.created_at).toISOString().split('T')[0]

      switch (log.type) {
        case 'deposit':
          totalInvestment += log.balance || 0

          if (logDate === currentDate) {
            todayEarnings += log.balance || 0
          }
          break
        case 'daily profit':
          totalEarnings += log.balance || 0

          if (logDate === currentDate) {
            todayEarnings += log.balance || 0
          }
          break
        case 'withdrawa Approved':
          totalWithdrawals += log.balance || 0
          break
        case 'withdraw request':
          pendingWithdrawls += log.balance || 0
          break
        default:
          // Other log types can be handled as needed
          break
      }
    })

    // Calculate total investment (total deposits)

    // Create an object to store the statistics
    const statistics = {
      totalEarnings,
      todayEarnings,
      totalInvestment,
      totalWithdrawals,
      currentBalance,
      pendingWithdrawls,
      totalBuyPlans,
      referalEarning
    }

    // Return the statistics and user data as a JSON response
    res.status(200).json(statistics)
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
