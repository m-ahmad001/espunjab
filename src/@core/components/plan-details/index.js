/* eslint-disable lines-around-comment */
// ** MUI Imports
import { Dialog, DialogContent, Slider, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// ** Custom Components Imports
import { useState } from 'react'
import CustomChip from 'src/@core/components/mui/chip'
import supabase from 'src/configs/supabase'
import { useBoolean } from 'src/hooks/use-boolean'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(6),
  paddingTop: theme.spacing(14.75),
  borderRadius: theme.shape.borderRadius
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& > :not(:first-of-type)': {
    marginTop: theme.spacing(4)
  }
}))

const PlanDetails = props => {
  const { user } = useAuth()

  // ** Props
  const { plan, data } = props

  // New state for deposit
  const [depositDialogOpen, setDepositDialogOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState(10)

  const [transactionId, setTransactionId] = useState('')
  const [planId, setPlanId] = useState({})

  const loading = useBoolean()

  const walletAddress = 'TWva3hEmSu5XpCRei4G7bh5LFKDqzBenUq' // Replace with actual wallet address

  const handleDepositOpen = plan => {
    setPlanId(plan)
    setDepositDialogOpen(true)
  }

  const investmentRanges = {
    Basic: { min: 10, max: 100 },
    Standard: { min: 100, max: 500 },
    Enterprise: { min: 500, max: 1000 }
  }

  const handleDepositApply = async () => {
    const selectedPlan = planId.title
    const { min, max } = investmentRanges[selectedPlan]

    if (investmentAmount < min || investmentAmount > max) {
      alert(`For the ${selectedPlan} plan, the deposit must be between $${min} and $${max}.`)

      return // Stop the function if the condition is not met
    }
    loading.onTrue()
    if (!transactionId) return toast.error('transaction id required')

    const { data, error } = await supabase.from('deposits').insert({
      transactionId: transactionId || null,
      user_id: user.id,
      email: user.email,
      amount: investmentAmount,
      plan_id: planId.title
    })

    if (error) {
      loading.onFalse()
      setDepositDialogOpen(false)

      return toast.error(
        error?.message.includes('transactionId') ? 'Transaction id Required' : 'Something went wrong!,Try again'
      )
    }
    setTransactionId('')
    setInvestmentAmount(10)
    loading.onFalse()

    toast.success('Your Request is Submitted Successfully.')
    setDepositDialogOpen(false)
  }

  const renderFeatures = () => {
    return data?.planBenefits.map((item, index) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component='span' sx={{ display: 'inline-flex', color: 'text.secondary', mr: 2 }}>
          <Icon icon='mdi:circle-outline' fontSize='0.75rem' />
        </Box>
        <Typography variant='body2'>{item}</Typography>
      </Box>
    ))
  }

  return (
    <>
      <BoxWrapper
        sx={{
          border: theme =>
            !data?.popularPlan
              ? `1px solid ${theme.palette.divider}`
              : `1px solid ${hexToRGBA(theme.palette.primary.main, 0.5)}`
        }}
      >
        {data?.popularPlan ? (
          <CustomChip
            skin='light'
            label='Popular'
            color='primary'
            sx={{
              top: 12,
              right: 12,
              height: 24,
              position: 'absolute',
              '& .MuiChip-label': {
                px: 1.75,
                fontWeight: 600,
                fontSize: '0.75rem'
              }
            }}
          />
        ) : null}
        <Box sx={{ mb: 5, display: 'flex', justifyContent: 'center' }}>
          <img
            width={data?.imgWidth}
            src={`${data?.imgSrc}`}
            height={data?.imgHeight}
            alt={`${data?.title.toLowerCase().replace(' ', '-')}-plan-img`}
          />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 1.5 }}>
            {data?.title}
          </Typography>
          <Typography variant='body2'>{data?.subtitle}</Typography>
          <Box sx={{ my: 7, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant='h5' sx={{ mt: 1.6, fontWeight: 600, alignSelf: 'flex-start' }}>
                $
              </Typography>
              <Typography variant='h4' sx={{ fontWeight: 600, color: 'primary.main', lineHeight: 1.17 }}>
                {plan === 'monthly' ? data?.monthlyPrice : data?.yearlyPlan.perMonth}
              </Typography>
              <Typography variant='body2' sx={{ mb: 1.6, fontWeight: 600, alignSelf: 'flex-end' }}>
                /month
              </Typography>
            </Box>
            {plan !== 'monthly' && data?.monthlyPrice !== 0 ? (
              <Typography
                variant='caption'
                sx={{ top: 50, left: '50%', position: 'absolute', transform: 'translateX(-50%)' }}
              >{`USD ${data?.yearlyPlan.totalAnnual}/year`}</Typography>
            ) : null}
          </Box>
        </Box>
        <BoxFeature>{renderFeatures()}</BoxFeature>
        <Button
          fullWidth
          color={data?.currentPlan ? 'success' : 'primary'}
          variant={data?.popularPlan ? 'contained' : 'outlined'}
          onClick={() => handleDepositOpen(data)}
        >
          Upgrade
          {/* {data?.currentPlan ? 'Your Current Plan' : 'Upgrade'} */}
        </Button>

        {/* Deposit Dialog */}
        <Dialog open={depositDialogOpen} onClose={() => setDepositDialogOpen(false)}>
          <DialogContent>
            <Typography variant='h6'>Deposit to Wallet: {walletAddress}</Typography>
            <Box sx={{ my: 5 }} />
            <Typography variant='body1' fontWeight={400}>
              Select your investment amount:
            </Typography>
            <Slider
              value={investmentAmount}
              onChange={(event, newValue) => setInvestmentAmount(newValue)}
              aria-labelledby='investment-slider'
              valueLabelDisplay='auto'
              min={10}
              max={1000}
              step={10}
            />
            <Typography variant='body1' fontWeight={400}>
              Investment Amount: ${investmentAmount}
            </Typography>

            <TextField
              label='TRX Transaction ID'
              fullWidth
              margin='normal'
              value={transactionId}
              onChange={e => setTransactionId(e.target.value)}
            />
            <LoadingButton
              loading={loading.value}
              sx={{ mt: 2 }}
              variant='contained'
              fullWidth
              onClick={handleDepositApply}
            >
              Apply
            </LoadingButton>
          </DialogContent>
        </Dialog>
      </BoxWrapper>
    </>
  )
}

export default PlanDetails
