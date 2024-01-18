/* eslint-disable lines-around-comment */
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports

// ** Styled Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Icon Imports

// ** Demo Components Imports
import { IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import TeamTable from 'src/views/teams/TeamTable'
import IconifyIcon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

const Teams = () => {
  const { user } = useAuth()
  const url = window.location.origin + `/register/?id=${user.username}`
  console.log('🚀 ~ Teams ~ url:', url)

  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <Typography variant='h3' color='white'>
              Your Teams
            </Typography>
            <Typography>Here is your all teams member that you reffered.</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={url}
              fullWidth
              label='Referal link'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='Copy to clipboard'
                      onClick={() => {
                        navigator.clipboard.writeText(url)
                        toast('Copied ✔')
                      }}
                    >
                      <IconifyIcon icon='solar:copy-bold-duotone' />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <TeamTable />
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <EcommerceActivityTimeline />
          </Grid> */}
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

Teams.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Teams
