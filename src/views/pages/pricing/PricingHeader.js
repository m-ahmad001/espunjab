// ** MUI Imports
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Import
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CustomChip from 'src/@core/components/mui/chip'

const PricingHeader = props => {
  // ** Props
  const { plan, handleChange } = props

  // ** Hook
  const hidden = useMediaQuery(theme => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ mb: [10, 17.5], textAlign: 'center' }}>
      <Typography variant='h4'>Plans Pricing</Typography>
      <Box sx={{ mt: 2.5, mb: 10.75 }}>
        <Typography variant='body2'>
          "Our offerings are meticulously designed to ensure exceptional value for your investment, coupled with a
          streamlined system for efficient revenue generation.
        </Typography>
        <Typography variant='body2'>
          Explore our range of tailored plans and select the one that perfectly aligns with your unique needs and goals.
        </Typography>
      </Box>
    </Box>
  )
}

export default PricingHeader
