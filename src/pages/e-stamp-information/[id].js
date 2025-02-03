/* eslint-disable react-hooks/exhaustive-deps */
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
import Barcode from 'react-barcode'
import { Margin, usePDF } from 'react-to-pdf'
import supabase from 'src/configs/supabase'
import { fDate, fDateTime } from 'src/utils/format-time'
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

  const urdu =
    'نوٹ : یہ ٹرانزیکشن تاریخ اجرا سے سات دنوں تک کے لیے قابل استعمال ہے ۔ ای اسٹامپ کی تصدیق بذریہ ویب سائٹ کیوآر کوڈ یا ایس ایم ایس سے کی جا سکتی ہے'

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

  function convertToLetterCase(str) {
    return str?.toLowerCase()?.replace(/\b\w/g, function (char) {
      return char?.toUpperCase()
    })
  }

  const dataEntries = [
    {
      key: 'ID:',
      value: (
        <Typography sx={{ fontFamily: 'Calibri', fontWeight: 700, color: 'black', lineHeight: 1, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {userData?.auto_id}
        </Typography>
      )
    },
    {
      key: 'Type:',
      value: (
        <Typography sx={{ fontFamily: 'Calibri', fontWeight: 700, color: 'black', lineHeight: 1, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {userData?.recordType || '-'}
        </Typography>
      )
    },
    {
      key: 'Amount:',
      value: (
        <Typography
          sx={{
            fontFamily: 'Calibri',
            fontWeight: 500,
            color: 'black',
            lineHeight: 1,
            fontSize: '12px',
            fontWeight: 'bolder',
            fontStyle: '-moz-initial',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
          }}
        >
          Rs {userData?.type_amount}/-
        </Typography>
      )
    },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: '', value: '' },
    { key: 'Description:', value: userData?.description },
    { key: 'Applicant:', value: userData?.applicant_name },
    { key: `${userData?.checkbox}:`, value: userData?.userName },
    { key: 'Agent:', value: userData?.agent },
    { key: 'Address:', value: userData?.address },
    {
      key: 'Issue Date:',
      value: fDateTime(userData?.issue_date)
    },
    { key: 'Delisted On/Validity:', value: fDate(userData?.validity, '') },
    {
      key: 'Amount in words:',
      value: convertToLetterCase(userData?.amountInWords) + ' ' + 'Rupees Only'
    },
    { key: 'Reason:', value: userData?.reason },
    { key: 'Vendor Information:', value:   <Typography sx={{ fontFamily: 'Calibri', color: 'black', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userData?.vendor_information}</Typography> }
  ]

  return (
    <Box sx={{ width: ' 210mm', height: '297mm', margin: '0 auto', }}>
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
            my: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            textDecoration: 'underline',
            textDecorationThickness: '2px',
            color: 'black'
          }}
        >
          E-STAMP
        </Typography>
        <Grid container spacing={1} sx={{ paddingLeft: '70px', paddingRight: '40px' }}>
          {/* ### RECORD INFO */}
          {/* <Grid item xs={12} ml={-2}></Grid> */}
          <Grid item xs={8}>
            <Box sx={{ width: '250px', py: 2 }}>
              <img style={{ width: '100%' }} src='/code.png' alt='Whats-App-Image-2024-01-29-at-16-38-37-9fc7bb33' />
            </Box>

            {/* <div style={{ marginLeft: -10 }}> */}
            {/* <Barcode value={userData?.auto_id} height='35' width='1' displayValue='false' /> */}
            {/* </div> */}
            {dataEntries.map((entry, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}
              >
                <Stack>
                  <Typography
                    variant='body2'
                    sx={{ fontFamily: 'Calibri', color: 'black', fontSize: '12px', lineHeight: 1 }}
                  >
                    {entry.key}
                  </Typography>
                </Stack>
                <Stack sx={{ width: 260 }} alignItems={'self-start'}>
                  <Typography
                    variant='body2'
                    sx={{
                      fontFamily: 'Calibri',
                      textAlign: 'left',
                      color: 'black',
                      fontSize: '12px',
                      lineHeight: 1
                    }}
                  >
                    {entry.value}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Grid>

          {/* ### QRCODE SCANNING */}
          <Grid item xs={4} sx={{ alignItems: 'left' }}>
            <Box
              sx={{
                padding: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <QRCode
                value={`https://espunjab.online/eStampCitizenPortal/GeneratePDF/Stamp_Receipt.html/${userData?.auto_id}`}
                size={100}
                level='H'
              />
              <Typography
                variant='body2'
                gutterBottom
                my={3}
                color='black'
                fontSize={11}
                sx={{ fontFamily: 'Calibri' }}
              >
                <b>Scan for online verification</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: '20px', width: '630px' }}>
            <img src='/stamp.png' alt='Image Alt Text' style={{ width: '100%', height: '97px' }} />
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
