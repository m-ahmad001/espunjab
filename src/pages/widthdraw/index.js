// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  Slider,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import EcommerceActivityTimeline from 'src/views/dashboards/ecommerce/EcommerceActivityTimeline'
import { useAuth } from 'src/hooks/useAuth'
import supabase from 'src/configs/supabase'
import toast from 'react-hot-toast'
import { useBoolean } from 'src/hooks/use-boolean'
import { LoadingButton } from '@mui/lab'

const Widthdraw = () => {
  const { user, initAuth, setUser } = useAuth()

  const loading = useBoolean()
  const [amount, setAmount] = useState(10)
  const [currentBalance, setCurrentBalance] = useState(user.balance) // Starting balance
  const [dialogOpen, setDialogOpen] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [error, setError] = useState('')
  const deduction = 0.1 // 10 percent
  const netAmount = amount - amount * deduction
  console.log('🚀 ~ Widthdraw ~ amount:', amount)

  const handleSliderChange = (event, newValue) => {
    setAmount(newValue)
  }

  const handleWithdraw = () => {
    setError('') // Clear previous error (if any)
    setDialogOpen(true)
  }

  const handleApply = async () => {
    if (amount > currentBalance) {
      setError('Your current balance is less than the withdraw amount.')

      return
    }
    loading.onTrue()
    toast.loading('Saving...')

    const { data: withdraw, error: err } = await supabase.from('withdraws').insert({
      user_id: user.id,
      wallet_id: accountNumber,
      amount: netAmount
    })
    if (err) return toast.error('Please try again later')

    const { data, error } = await supabase
      .from('users')
      .update({
        balance: currentBalance - amount
      })
      .eq('id', user.id)

    if (error) return toast.error('Please try again later')

    const { data: logs, error: logErr } = await supabase.from('logs').insert({
      user_id: user.id,
      plan_id: '-',
      balance: amount,
      type: 'withdraw request'
    })
    loading.onFalse()

    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount
    }))

    toast.dismiss()
    toast('Withdraw Requested')
    setCurrentBalance(prevBalance => prevBalance - amount)
    setDialogOpen(false)
    setError('') // Clear error after successful withdrawal
  }

  useEffect(() => {
    setCurrentBalance(user.balance)
  }, [user])

  return (
    <>
      <Box sx={{ mb: '30px' }}>
        <Typography variant='h3' color='white'>
          Withdraw
        </Typography>
        <Typography>Here you can withdraw your earning amount direct in your bank account.</Typography>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Card sx={{ minWidth: '100px', padding: 1 }}>
              <CardContent>
                <Typography sx={{ fontSize: 25 }} color='white' gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant='h4' component='div' sx={{ m: '10px', fontSize: '40px' }}>
                  $ {currentBalance}
                </Typography>
                {/* <Icon icon='streamline-emojis:money-with-wings' /> */}
                <Typography variant='h5' component='div' color='white'>
                  Withdraw Amount
                </Typography>
                <Slider
                  value={amount}
                  onChange={handleSliderChange}
                  step={5}
                  marks
                  min={10}
                  max={1000}
                  valueLabelDisplay='auto'
                />
                <Stack spacing={3}>
                  <Typography variant='h6' sx={{ mb: 1.5 }}>
                    Amount: ${amount}
                  </Typography>
                  <Typography variant='h6' sx={{ mb: 1.5 }}>
                    Deduction (10%): ${amount * deduction}
                  </Typography>
                  <Typography variant='h5'>Net Withdraw Amount: ${netAmount}</Typography>
                </Stack>
                <Button sx={{ mt: '20px' }} fullWidth variant='contained' onClick={handleWithdraw}>
                  Withdraw
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5} sx={{ height: '100%' }}>
            {/* <EcommerceActivityTimeline /> */}
          </Grid>
        </Grid>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogContent>
            <Typography variant='h6'>Withdraw Amount: ${netAmount}</Typography>
            <TextField
              label='Wallet Id'
              fullWidth
              margin='normal'
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
            />
            <TextField
              label='Wallet Name'
              fullWidth
              margin='normal'
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
            />
            {error && (
              <Alert severity='error' sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <LoadingButton loading={loading.value} sx={{ mt: 2 }} variant='contained' fullWidth onClick={handleApply}>
              Apply For Withdraw
            </LoadingButton>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  )
}

Widthdraw.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Widthdraw
