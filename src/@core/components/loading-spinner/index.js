import React from 'react'
import Stack from '@mui/material/Stack'
import IconifyIcon from '../icon'

const LoadingSpinner = () => (
  <Stack
    sx={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9999 /* Adjust the z-index value as needed */,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)' /* Optional: Add a semi-transparent background */
    }}
  >
    {/* <ReactLoading type="spinningBubbles" color="primary" /> */}
    <IconifyIcon icon='svg-spinners:12-dots-scale-rotate' width={50} color='red' />
  </Stack>
)

export default LoadingSpinner
