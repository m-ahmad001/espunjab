import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mcvnrgguafgjqltrhybx.supabase.co'

const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdm5yZ2d1YWZnanFsdHJoeWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTI2ODQxNjEsImV4cCI6MjAwODI2MDE2MX0.V3vJR9hUwndVluaPMw3LrS-zkNtUhlL0VPYvAqE0nwo' // Replace with your actual Supabase key
const supabase = createClient(supabaseUrl, supabaseKey)

export default async (req, context) => {
  const { next_run } = await req.json()
  console.log('🚀 ~ next_run:', next_run)

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, plans, balance, last_update')
      .not('plans', 'eq', '[]')

    if (error) {
      console.error('Error fetching users:', error.message)

      // return context.status(500).json({ error: 'Failed to fetch users.' })
    }

    const updatePromises = []

    for (const userData of data) {
      const activePlans = userData.plans.filter(plan => !plan.expired)

      if (activePlans.length > 0) {
        const logs = []
        let totalProfit = 0

        for (const activePlan of activePlans) {
          const profitPercentage = getProfitPercentage(activePlan.plan_id)
          const profit = activePlan.amount * profitPercentage
          const expirationDate = new Date(activePlan.expiration)
          const now = new Date()

          if (expirationDate <= now) {
            console.log(`Plan expired for user ${userData.id}, plan ${activePlan.plan_id}`)
            continue
          }

          if (profit > 0) {
            totalProfit += profit
            logs.push({
              user_id: userData.id,
              balance: profit,
              type: 'daily profit',
              plan_id: activePlan.plan_id
            })
          }
        }

        // Check if the user's balance has been updated today
        const lastUpdateDate = new Date(userData?.last_update)
        const isUpdateDoneToday = lastUpdateDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]

        if (totalProfit > 0 && !isUpdateDoneToday) {
          // Batch update user balance and insert log entries
          updatePromises.push(
            supabase
              .from('users')
              .update({ balance: userData.balance + totalProfit, last_update: now.toISOString() })
              .eq('id', userData.id)
          )

          updatePromises.push(supabase.from('logs').insert(logs))
        }
      } else {
        console.log('User has no active plans:', userData.id)
      }
    }

    // Wait for all update promises to complete
    await Promise.all(updatePromises)

    // return context.status(200).json({ message: 'Daily profits calculated and stored.' })
    console.log('Daily profits calculated and stored.')
  } catch (error) {
    console.error('Error processing profits:', error.message)

    // return context.status(500).json({ error: 'An error occurred.' })
  }
}

export const config = {
  schedule: '@daily'
}

function getProfitPercentage(planId) {
  const monthlyPercentages = {
    Basic: 0.2,
    Standard: 0.2,
    Enterprise: 0.2
  }
  const percentage = monthlyPercentages[planId] || 0

  return percentage // Divide by 30 to get the daily percentage
}
