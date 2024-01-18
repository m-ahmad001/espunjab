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
import TransactionsTable from 'src/views/transactions/TransactionsTable'

const HistoryRecord = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <Typography variant='h3' color='white'>
              Transaction History
            </Typography>
            <Typography>Here is your all last buyed plans history by date and time.</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <TransactionsTable />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <EcommerceActivityTimeline />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

HistoryRecord.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default HistoryRecord
