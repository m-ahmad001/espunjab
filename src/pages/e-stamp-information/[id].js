// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { saveAs } from 'file-saver'

// ** Icon Imports

// ** Custom Components

// ** Utils Import
import { Button, Grid, Paper, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import QRCode from 'qrcode.react'
import { useEffect, useState } from 'react'
import supabase from 'src/configs/supabase'
import { fDate, fDateTime } from 'src/utils/format-time'
import { Margin, usePDF } from 'react-to-pdf'
import Barcode from 'react-barcode'
import axios from 'axios'
import Image from 'next/image'

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
    } catch (error) {
      console.log('🚀 ~ getData ~ error:', error)
    }
  }

  // STATES
  useEffect(() => {
    getData()
  }, [])

  const dataEntries = [
    {
      key: 'ID:',
      value: <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{userData?.auto_id}</Typography>
    },
    {
      key: 'Type:',
      value: <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{userData?.recordType || '-'}</Typography>
    },

    {
      key: 'Amount:',
      value: <Typography sx={{ fontWeight: 'bold', color: 'black' }}>{userData?.type_amount}</Typography>
    },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: 'Description:', value: userData?.description },
    { key: 'Applicant Name:', value: userData?.applicant_name },
    { key: `${userData?.checkbox}:`, value: userData?.userName },
    { key: 'Agent:', value: userData?.agent },
    { key: 'Address:', value: userData?.address },
    {
      key: 'Issue Date:',
      value: fDateTime(userData?.issue_date)
    },
    { key: 'Delisted On/Validity:', value: fDateTime(userData?.validity) },
    {
      key: 'Amount in words:',
      value: userData?.amountInWords
    },
    { key: 'Reason:', value: userData?.reason },
    { key: 'Vendor Information:', value: userData?.vendor_information }

    // { key: 'Created At:', value: new Date(userData?.created_at).toLocaleString() }
  ]

  return (
    <Box sx={{ width: ' 210mm', height: '297mm', margin: '0 auto' }}>
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
        <Typography
          variant='h4'
          sx={{
            my: 4,
            textAlign: 'center',
            fontWeight: 'bold',
            textDecoration: 'underline',
            textDecorationThickness: '2px',
            color: 'black'
          }}
        >
          E-STAMP
        </Typography>
        <Grid container spacing={2}>
          {/* ### RECORD INFO */}

          <Grid item xs={8}>
            <Barcode value={userData?.auto_id} height='35' width='1' />
            {dataEntries.map((entry, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}
              >
                <Stack>
                  <Typography variant='body1' sx={{ color: 'black' }}>
                    {entry.key}
                  </Typography>
                </Stack>
                <Stack sx={{ width: 300 }} alignItems={'self-start'}>
                  <Typography variant='body1' sx={{ textAlign: 'left', color: 'black' }}>
                    {entry.value}
                  </Typography>
                </Stack>
              </Box>
            ))}

            <Box sx={{ p: 3, my: 7 }}>
              <Image width={700} src='/stamp.png' height={100} />{' '}
            </Box>
          </Grid>

          {/* ### QRCODE SCANNING */}
          <Grid item xs={4}>
            <Box
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'

                // justifyContent: 'center'
              }}
            >
              <QRCode value={`https://espunjabs.netlify.app/?eStampId=${userData?.auto_id}`} size={100} />
              <Typography variant='body1' gutterBottom my={3} color='black'>
                Scan for online verification
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

RecordView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default RecordView
