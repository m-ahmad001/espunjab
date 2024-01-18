/* eslint-disable lines-around-comment */
// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import { useAuth } from 'src/hooks/useAuth'

const renderStats = salesData => {
  return salesData.map((sale, index) => (
    <Grid item xs={12} sm={4} key={index}>
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <CustomAvatar skin='light' variant='rounded' color={sale.color} sx={{ mr: 4 }}>
          {sale.icon}
        </CustomAvatar>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {sale.stats}
          </Typography>
          <Typography variant='caption'>{sale.title}</Typography>
        </Box>
      </Box>
    </Grid>
  ))
}

const EcommerceSalesOverview = ({ statistics }) => {
  const salesData = [
    {
      stats: statistics?.totalBuyPlans,
      color: 'primary',
      title: 'Current Plan',
      icon: <Icon icon='mdi:account-outline' />
    },
    {
      stats: statistics?.todayEarnings,
      color: 'success',
      title: 'Today Profit',
      icon: <Icon icon='mdi:poll' />
    },
    {
      color: 'info',
      stats: statistics?.pendingWithdrawls,
      title: 'Pending Withdrawls',
      icon: <Icon icon='mdi:trending-up' />
    }
  ]

  return (
    <Card>
      <CardHeader
        sx={{ pb: 3.25 }}
        title='Earning Overview'
        titleTypographyProps={{ variant: 'h6' }}
        // action={
        //   <OptionsMenu
        //     options={['Last 28 Days', 'Last Month', 'Last Year']}
        //     iconButtonProps={{ size: 'small', className: 'card-more-options' }}
        //   />
        // }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { color: 'success.main' } }}>
            {/* <Typography variant='caption' sx={{ mr: 1.5 }}>
              Total 42.5k Sales
            </Typography> */}
            <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
              +18%
            </Typography>
            <Icon icon='mdi:chevron-up' fontSize={20} />
          </Box>
        }
      />
      <CardContent>
        <Grid container spacing={6}>
          {renderStats(salesData)}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default EcommerceSalesOverview
