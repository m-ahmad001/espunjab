// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Box from '@mui/material/Box'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// ** Icon Imports

// ** Third Party Imports
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import { LoadingButton } from '@mui/lab'
import { Alert } from '@mui/material'
import { Stack } from '@mui/system'
import axios from 'axios'
import { useRouter } from 'next/router'
import { RHFTextField } from 'src/@core/components/hook-form'
import FormProvider from 'src/@core/components/hook-form/form-provider'
import IconifyIcon from 'src/@core/components/icon'
import supabase from 'src/configs/supabase'
import { useBoolean } from 'src/hooks/use-boolean'
import { useAuth } from 'src/hooks/useAuth'
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
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

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const defaultValues = {
  username: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  role: 'client',
  email: '',
  password: ''
}

const Register = () => {
  const router = useRouter()

  const { id } = router?.query
  console.log('🚀 ~ Register ~ slug:', id)

  const password = useBoolean()

  const [errorMsg, setErrorMsg] = useState('')

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(5).required(),
    username: yup.string().min(3).required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    phone: yup.string().required()
  })
  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  const methods = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const {
    control,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods
  const [ip, setIp] = useState({})

  const onSubmit = handleSubmit(async param => {
    const { username, firstName, lastName, phone, role, email, password, reffer_id } = param

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })
    console.log('🚀 ~ signUpNewUser ~ data:', data.user.id)

    // signUpNewUser()

    auth.register({
      username,
      firstName,
      lastName,
      phoneNumber: phone,
      role,
      email,
      password,
      user_id: data.user.id,
      ip,
      reffer_id
    })
  })

  // -
  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity='error'>{errorMsg}</Alert>}

      <RHFTextField name='reffer_id' label='Reffer Id' />
      <RHFTextField name='username' label='Username' />
      <RHFTextField name='firstName' label='First Name' />
      <RHFTextField name='lastName' label='Last Name' />

      <RHFTextField name='phone' label='Phone' />

      <RHFTextField name='email' label='Email address' />

      <RHFTextField
        name='password'
        label='Password'
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton onClick={password.onToggle} edge='end'>
                <IconifyIcon icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />

      <LoadingButton fullWidth color='primary' size='large' type='submit' variant='contained' loading={isSubmitting}>
        Create account
      </LoadingButton>
    </Stack>
  )

  useEffect(() => {
    getIP()
    if (id) {
      setValue('reffer_id', id)
    }
  }, [id])

  const getIP = async () => {
    try {
      // const response = await axios.get('https://apiip.net/api/check?accessKey=b388944a-e2bf-4b33-bebd-1d9dc5ffa663')
      // if (response?.data?.ip) {
      // setIp(response?.data)
      // }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <RegisterIllustrationWrapper>
            <RegisterIllustration
              alt='register-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </RegisterIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-register-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box
              sx={{
                top: 30,
                left: 40,
                display: 'flex',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width={47} fill='none' height={26} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint0_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fillOpacity='0.4'
                  fill='url(#paint1_linear_7821_79167)'
                  transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                />
                <rect
                  rx='25.1443'
                  width='50.2886'
                  height='143.953'
                  fill={theme.palette.primary.main}
                  transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                />
                <defs>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint0_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                  <linearGradient
                    y1='0'
                    x1='25.1443'
                    x2='25.1443'
                    y2='143.953'
                    id='paint1_linear_7821_79167'
                    gradientUnits='userSpaceOnUse'
                  >
                    <stop />
                    <stop offset='1' stopOpacity='0' />
                  </linearGradient>
                </defs>
              </svg>
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                {themeConfig.templateName}
              </Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>Adventure starts here 🚀</TypographyStyled>
              <Typography variant='body2'>Make your app management easy and fun!</Typography>
            </Box>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              {renderForm}
            </FormProvider>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
