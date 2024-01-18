// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

// ** Icon Imports

// ** Custom Components

// ** Utils Import
import { Button, Grid, Paper, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react'
import { useEffect, useState } from 'react'
import supabase from 'src/configs/supabase'
import { fDate } from 'src/utils/format-time'
import { Margin, usePDF } from 'react-to-pdf'

const statusObj = {
  true: { color: 'success', text: 'Approved' },
  false: { color: 'warning', text: 'Rejected' },
  null: { color: 'primary', text: 'Pending' }
}

const RecordView = () => {
  const [userData, setUserData] = useState({})
  const router = useRouter()
  const { id } = router.query
  const { toPDF, targetRef } = usePDF({ filename: `${id}.pdf`, page: { margin: Margin.MEDIUM } })

  console.log('🚀 ~ RecordView ~ id:', id)

  // *** HANDLE GET REQUEST
  const getData = async () => {
    try {
      let { data: deposits, error } = await supabase.from('forms').select('*').eq('auto_id', id).single()
      setUserData(deposits)

      // console.log('🚀 ~ getData ~ data:', deposits)

      setRows(deposits)
    } catch (error) {
      console.log('🚀 ~ getData ~ error:', error)
    }
  }

  // STATES
  useEffect(() => {
    getData()
  }, [])

  const dataEntries = [
    { key: 'User ID', value: userData?.id },
    { key: 'Issue Date', value: fDate(userData?.issue_date) },
    { key: 'Type Amount', value: userData?.type_amount },
    { key: 'Validity', value: fDate(userData?.validity) },
    { key: 'Description', value: userData?.description },
    { key: 'Reason', value: userData?.reason },
    { key: 'Applicant Name', value: userData?.applicant_name },
    { key: 'Vendor Information', value: userData?.vendor_information },
    { key: userData?.checkbox, value: userData?.userName },
    { key: 'Agent', value: userData?.agent },
    { key: 'Address', value: userData?.address },
    { key: 'Auto ID', value: userData?.auto_id },
    { key: 'Created At', value: new Date(userData?.created_at).toLocaleString() }
  ]

  return (
    <>
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button
          variant='outlined'
          onClick={() => router.back()}
          sx={{
            mx: 3
          }}
        >
          Back
        </Button>
        <Button variant='contained' onClick={() => toPDF()}>
          Download PDF
        </Button>
      </Box>
      <Paper elevation={1} sx={{ padding: 5, height: '297mm' }} ref={targetRef}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            {dataEntries.map((entry, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}
              >
                <Stack>
                  <Typography variant='body1'>{entry.key}:</Typography>
                </Stack>
                <Stack sx={{ width: { md: 200 } }} alignItems={'self-start'}>
                  <Typography variant='body1' sx={{ textAlign: 'left' }}>
                    {entry.value}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Box elevation={1} sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant='h6' gutterBottom>
                QR Code
              </Typography>
              <QRCode value={JSON.stringify(userData)} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}

RecordView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default RecordView
