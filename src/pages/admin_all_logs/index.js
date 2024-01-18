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
import AllUsers from 'src/views/users/AllUsers'
import AdminLogs from 'src/views/admin-all-logs/AdminLogs'

const Admin_all_users = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <Typography variant='h3'>All Logs.</Typography>
            {/* <Typography>Here is your all Requests plans history by date and time.</Typography> */}
          </Grid>
          <Grid item xs={12} md={12}>
            <AdminLogs />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

Admin_all_users.acl = {
  action: 'manage',
  subject: 'admin'
}

export default Admin_all_users
