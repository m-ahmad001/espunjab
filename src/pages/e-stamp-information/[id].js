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

  const dataEntries = [
    {
      key: 'ID:',
      value: (
        <Typography sx={{ fontWeight: 500, color: 'black', lineHeight: 1, fontSize: '13px' }}>
          <b>{userData?.auto_id}</b>
        </Typography>
      )
    },
    {
      key: 'Type:',
      value: (
        <Typography sx={{ fontWeight: 500, color: 'black', lineHeight: 1, fontSize: '13px' }}>
          <b>{userData?.recordType || '-'}</b>
        </Typography>
      )
    },

    {
      key: 'Amount:',
      value: (
        <Typography
          sx={{
            fontWeight: 500,
            color: 'black',
            lineHeight: 1,
            fontSize: '12px',
            fontWeight: 'bolder',
            fontStyle: '-moz-initial'
          }}
        >
          <b>Rs {userData?.type_amount}/-</b>
        </Typography>
      )
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
      value: userData?.amountInWords + ' ' + 'Rupees Only'
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
            <div style={{ marginLeft: -10 }}>
              <Barcode value={userData?.auto_id} height='35' width='1' displayValue='false' />
            </div>
            {dataEntries.map((entry, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}
              >
                <Stack>
                  <Typography variant='body2' sx={{ color: 'black', fontSize: '12px', lineHeight: 1 }}>
                    {entry.key}
                  </Typography>
                </Stack>
                <Stack sx={{ width: 260 }} alignItems={'self-start'}>
                  <Typography
                    variant='body2'
                    sx={{ textAlign: 'left', color: 'black', fontSize: '12px', lineHeight: 1 }}
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
                value={`https://espunjabs.netlify.app/eStampCitizenPortal/GeneratePDF/Stamp_Receipt.html/${userData?.auto_id}`}
                size={90}
                level='H'
              />
              <Typography variant='body2' gutterBottom my={3} color='black' fontSize={11}>
                <b>Scan for online verification</b>
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ mt: '20px' }}>
            {/* <Box sx={{ border: '3px solid #202124', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              <Typography fontSize='12px' variant='body1' fontWeight='700' color='black' lang='ur' sx={{ padding: 3 }}>
                Note: This transaction is valid for seven days from the date of issue. E-Stamp can be verified through
                the website via Call or SMS.
                <div>Type "eStamp &lt;16 digit eStamp Number&gt;" send to "8100"</div>
              </Typography>
            </Box> */}
            <Image src='/stamp.png' alt='Image Alt Text' width={500} height={70} />
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
