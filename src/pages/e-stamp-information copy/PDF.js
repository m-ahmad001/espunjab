import { Box } from '@mui/material'
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import QRCode from 'qrcode.react'
import Barcode from 'react-barcode'

Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxMKTU1Kvnz.woff'
})

// Font.register({
//   family: 'Noto Nastaliq Urdu',
//   src: 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&display=swap'
// })

export const RecordPDF = ({ userData, dataEntries }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View>
        <Text style={styles.heading}>E-STAMP</Text>

        <View style={styles.columnsContainer}>
          {/* Fields */}
          <View style={styles.column}>
            <Barcode value={userData?.auto_id} height='35' width='1' />
            {dataEntries.map((entry, index) => (
              <Text key={index} style={styles.field}>
                {entry.key} <br />
              </Text>
            ))}
          </View>
          {/* Data */}
          <View style={styles.column}>
            {dataEntries.map((entry, index) => (
              <Text key={index} style={styles.data}>
                {entry.value} <br />
              </Text>
            ))}
          </View>
          {/* QR Code */}
          <View style={styles.column}>
            <QRCode value={JSON.stringify(userData)} style={styles.qrCode} />
          </View>
        </View>
        {/* Note */}
        <View style={styles.noteContainer}>
          <Box style={styles.noteBox}>
            <Text style={styles.noteText}>
              نوٹ: یہ ٹرانزیکشن صرف جاری ہونے کی تاریخ سے 7 دن تک درست ہے، اس اسکین کیو آر کوڈ کی تصدیق کے لیے یا 8100
              پر ایس ایم ایس بھیجیں۔
            </Text>
          </Box>
        </View>
      </View>
    </Page>
  </Document>
)

const styles = StyleSheet.create({
  page: {
    padding: 10,
    height: '297mm',
    fontFamily: 'Roboto,Noto Nastaliq Urdu'
  },
  heading: {
    textAlign: 'center',
    fontSize: 34,
    color: 'black',
    fontWeight: 'bold',
    textDecoration: 'underline',
    textDecorationThickness: 2,
    marginBottom: 10
  },
  columnsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10 // Added margin-top for better separation
  },
  column: {
    flex: 1
  },
  field: {
    marginBottom: 10,
    color: 'black'
  },
  data: {
    marginBottom: 10,
    color: 'black'
  },
  qrCode: {
    marginLeft: 'auto'
  },
  noteContainer: {
    marginTop: '30px'
  },
  noteBox: {
    marginTop: '40px',
    width: '70%',
    border: '3px solid black',
    padding: 10
  },
  noteText: {
    color: 'black'
  }
})
