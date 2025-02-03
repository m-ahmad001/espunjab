// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import supabase from 'src/configs/supabase'
import { useState } from 'react'

// Styled Components
const UpdatePasswordIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const UpdatePasswordIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must contain 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special case character'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

const UpdatePassword = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    },
    resolver: yupResolver(schema)
  })

  const onSubmit = async data => {
    try {
      const { data: updateData, error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) throw error

      toast.success('Password updated successfully')
      reset()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const imageSource = settings.skin === 'bordered' ? 'auth-v2-reset-password-illustration-bordered' : 'auth-v2-reset-password-illustration'

  return (
    <Box
      sx={{
        display: 'flex',

        alignItems: 'center',
        justifyContent: 'center',

      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 5, md: 7 },
          width: '100%',
          maxWidth: { xs: '90%', sm: 400 },
          borderRadius: 1,
          boxShadow: theme => theme.shadows[3],
          mx: { xs: 2, sm: 'auto' },
          backgroundColor: 'background.paper'
        }}
      >
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <Typography variant='h5' sx={{ mb: 1.5, textAlign: 'center', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Update Password 🔒
          </Typography>
          <Typography variant='body2' sx={{ textAlign: 'center' }}>
            Please enter your new password
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
            <InputLabel htmlFor='new-password' error={Boolean(errors.newPassword)}>
              New Password
            </InputLabel>
            <Controller
              name='newPassword'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label='New Password'
                  onChange={onChange}
                  id='new-password'
                  error={Boolean(errors.newPassword)}
                  type={showNewPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <Icon icon={showNewPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.newPassword && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.newPassword.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: { xs: 3, sm: 4 } }}>
            <InputLabel htmlFor='confirm-password' error={Boolean(errors.confirmPassword)}>
              Confirm Password
            </InputLabel>
            <Controller
              name='confirmPassword'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <OutlinedInput
                  value={value}
                  label='Confirm Password'
                  onChange={onChange}
                  id='confirm-password'
                  error={Boolean(errors.confirmPassword)}
                  type={showConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <Icon icon={showConfirmPassword ? 'mdi:eye-outline' : 'mdi:eye-off-outline'} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            {errors.confirmPassword && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.confirmPassword.message}</FormHelperText>
            )}
          </FormControl>

          <Button
            fullWidth
            size='large'
            type='submit'
            variant='contained'
            sx={{ mb: { xs: 3, sm: 4 } }}
          >
            Update Password
          </Button>
        </form>
      </Box>
    </Box>
  )
}
UpdatePassword.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default UpdatePassword 