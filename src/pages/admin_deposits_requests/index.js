/* eslint-disable lines-around-comment */
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Icon Imports

// ** Demo Components Imports
import { Typography } from '@mui/material'
import DepositTable from 'src/views/depoits/DepositTable'

const Admin_deposits_requests = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <Typography variant='h3' color='white'>
              Deposit Requests
            </Typography>
            <Typography>Here is your all Requests plans history by date and time.</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <DepositTable />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <EcommerceActivityTimeline />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

Admin_deposits_requests.acl = {
  action: 'manage',
  subject: 'admin'
}

export default Admin_deposits_requests
