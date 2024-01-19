import React, { useEffect, useState } from 'react'
import { Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'
import { Box, Typography, Button, Paper } from '@mui/material'
import QRCode from 'qrcode.react'
import Barcode from 'react-barcode'
import supabase from 'src/configs/supabase'
import { fDate } from 'src/utils/format-time'
import { useRouter } from 'next/router'
import { RecordPDF } from './PDF'

const RecordView = () => {
  const [userData, setUserData] = useState({})
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const getData = async () => {
      try {
        let { data: deposits, error } = await supabase.from('forms').select('*').eq('auto_id', id).single()
        setUserData(deposits)
      } catch (error) {
        console.log('Error:', error)
      }
    }

    getData()
  }, [id])

  const dataEntries = [
    {
      key: 'Issue Date:',
      value: <Text style={{ fontWeight: 'bold', color: 'black' }}>{fDate(userData?.issue_date)}</Text>
    },
    {
      key: 'Auto ID:',
      value: <Text style={{ fontWeight: 'bold', color: 'black' }}>{userData?.auto_id}</Text>
    },
    {
      key: 'Type:',
      value: <Text style={{ fontWeight: 'bold', color: 'black' }}>{userData?.recordType || '-'}</Text>
    },
    {
      key: 'Type Amount:',
      value: <Text style={{ fontWeight: 'bold', color: 'black' }}>{userData?.type_amount}</Text>
    },
    { key: '', value: '' },
    { key: 'Validity:', value: fDate(userData?.validity) },
    { key: 'Description:', value: userData?.description },
    { key: 'Reason:', value: userData?.reason },
    { key: 'Applicant Name:', value: userData?.applicant_name },
    { key: 'Vendor Information:', value: userData?.vendor_information },
    { key: `${userData?.checkbox}:`, value: userData?.userName },
    { key: 'Agent:', value: userData?.agent },
    { key: 'Address:', value: userData?.address },
    { key: 'Created At:', value: new Date(userData?.created_at).toLocaleString() }
  ]

  return (
    <>
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Button variant='outlined' onClick={() => router.back()} sx={{ mx: 3 }}>
          Back
        </Button>

        {/* <PDFDownloadLink document={<RecordPDF userData={userData} dataEntries={dataEntries} />} fileName={id + '.pdf'}>
          {({ loading }) =>
            loading ? (
              'loading...'
            ) : (
              <Button color='primary' variant='contained'>
                Export PDF
              </Button>
            )
          }
        </PDFDownloadLink> */}
      </Box>
      <Paper elevation={1} sx={{ padding: 5, height: '297mm' }}>
        <PDFViewer>
          <RecordPDF userData={userData} dataEntries={dataEntries} />
        </PDFViewer>
      </Paper>
    </>
  )
}

RecordView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default RecordView
