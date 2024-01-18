/* eslint-disable lines-around-comment */
import { useAuth } from 'src/hooks/useAuth'
import { useEffect, useState } from 'react'
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'
import EcommerceActivityTimeline from 'src/views/dashboards/ecommerce/EcommerceActivityTimeline'
import EcommerceImpressionsOrders from 'src/views/dashboards/ecommerce/EcommerceImpressionsOrders'
import EcommerceLiveVisitors from 'src/views/dashboards/ecommerce/EcommerceLiveVisitors'
import EcommerceMarketingSales from 'src/views/dashboards/ecommerce/EcommerceMarketingSales'
import EcommerceSalesOverview from 'src/views/dashboards/ecommerce/EcommerceSalesOverview'
import EcommerceSalesOverviewWithTabs from 'src/views/dashboards/ecommerce/EcommerceSalesOverviewWithTabs'
import EcommerceSalesThisMonth from 'src/views/dashboards/ecommerce/EcommerceSalesThisMonth'
import EcommerceTable from 'src/views/dashboards/ecommerce/EcommerceTable'
import EcommerceTotalVisits from 'src/views/dashboards/ecommerce/EcommerceTotalVisits'
import EcommerceVisitsByDay from 'src/views/dashboards/ecommerce/EcommerceVisitsByDay'
import EcommerceWeeklySalesBg from 'src/views/dashboards/ecommerce/EcommerceWeeklySalesBg'
import { Divider } from '@mui/material'
import useSWR from 'swr'
import toast from 'react-hot-toast'

const fetcher = async url => {
  const res = await fetch(url)
  const data = await res.json()

  return data
}

const EcommerceDashboard = () => {
  const { user } = useAuth()

  const { data: statistics, error } = useSWR(
    `${process.env.NEXT_PUBLIC_APIENDPOINT}/api/dashboard?userId=${user.id}`,
    fetcher
  )

  if (error) toast.error('Something went wrong!.😢')
  // const [statistics, setStatistics] = useState()
  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_APIENDPOINT}/api/dashboard?userId=${user.id}`)
  //     const statistics = await res.json()
  //     setStatistics(statistics)
  //     console.log('🚀 ~ getData ~ statistics:', statistics)
  //   }

  //   getData()
  // }, [])

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12} md={6}>
            <AnalyticsCongratulations />
          </Grid>
          <Grid item xs={12} md={2}>
            <CardStatisticsVertical
              stats={statistics?.currentBalance || 0}
              color='primary'
              trendNumber='+22%'
              title='Total Balance'
              chipText='Last 6 Month'
              icon={<Icon icon='noto:bank' />}
            />
          </Grid>

          <Grid item xs={6} md={2}>
            <CardStatisticsVertical
              stats={statistics?.totalEarnings || 0}
              color='primary'
              // trendNumber='+22%'
              title='Total Earning'
              chipText='Last 6 Month'
              icon={<Icon icon='vaadin:money-withdraw' />}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <CardStatisticsVertical
              stats={statistics?.totalWithdrawals || 0}
              color='primary'
              // trendNumber='+22%'
              title='Total Withdraw'
              chipText='Last 6 Month'
              icon={<Icon icon='vaadin:money-withdraw' />}
            />
          </Grid>
          {/* 2 */}
          <Grid item xs={12} md={6}>
            <EcommerceSalesOverview statistics={statistics} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: statistics?.referalEarning,
                title: 'Referal Earning',
                chipColor: 'primary',
                // trendNumber: '+15.6%',
                chipText: `Year of ${new Date().getFullYear().toString()}`,
                src: '/images/cards/card-stats-img-1.png'
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CardStatisticsCharacter
              data={{
                stats: statistics?.totalInvestment,
                trend: 'negative',
                title: 'Total Investment',
                chipColor: 'success',
                // trendNumber: '-25.5%',
                chipText: `Year of ${new Date().getFullYear().toString()}`,
                src: '/images/cards/card-stats-img-2.png'
              }}
            />
          </Grid>

          <Divider sx={{ mt: 5 }} />
          <Grid item xs={12} sm={6} md={4}>
            <EcommerceTotalVisits />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <EcommerceSalesThisMonth />
          </Grid>
          <Grid item xs={12} sm={6} md={5} sx={{ order: [0] }}>
            <EcommerceLiveVisitors />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <EcommerceActivityTimeline />
          </Grid> */}
          {/* <Grid item xs={12} md={6}>
            <EcommerceSalesOverviewWithTabs />
          </Grid> */}
          {/* <Grid item xs={12} sm={6} md={3}>
            <EcommerceImpressionsOrders />
          </Grid>
          <Grid item xs={12} md={5} sx={{ order: [2, 2, 1] }}>
            <EcommerceMarketingSales />
          </Grid>
          <Grid item xs={12} md={8} sx={{ order: 3 }}>
            <EcommerceTable />
          </Grid> */}
          {/* <Grid item xs={12} md={6} sx={{ order: 3 }}>
            <EcommerceVisitsByDay />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

EcommerceDashboard.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default EcommerceDashboard
