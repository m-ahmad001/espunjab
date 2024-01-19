import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode.react'

const generatePdf = async (userData, dataEntries) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()

  // Add a page to the document
  const page = pdfDoc.addPage()

  // Set the text font and size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontSize = 12

  // Draw the heading
  page.drawText('E-STAMP', { x: 150, y: 800, font, fontSize, color: rgb(0, 0, 0) })

  // Draw the columns
  const columnX = [50, 250, 450]
  const columns = ['Fields', 'Data', 'QR Code']

  columns.forEach((column, index) => {
    page.drawText(column, { x: columnX[index], y: 780, font, fontSize: 10, color: rgb(0, 0, 0) })
  })

  // Draw the data entries
  dataEntries.forEach((entry, index) => {
    page.drawText(entry.key, { x: columnX[0], y: 750 - index * 20, font, fontSize, color: rgb(0, 0, 0) })
    page.drawText(entry.value, { x: columnX[1], y: 750 - index * 20, font, fontSize, color: rgb(0, 0, 0) })
  })

  // Draw the QR Code
  // const qrCodeImage = await generateQRCodeImage(JSON.stringify(userData))
  // const qrCodeDims = qrCodeImage.scale(0.3) // Adjust the scale as needed
  // page.drawImage(qrCodeImage, {
  //   x: columnX[2],
  //   y: 750 - dataEntries.length * 20 - 20,
  //   width: qrCodeDims.width,
  //   height: qrCodeDims.height
  // })

  // Draw the note
  const noteText =
    'نوٹ: یہ ٹرانزیکشن صرف جاری ہونے کی تاریخ سے 7 دن تک درست ہے، اس اسکین کیو آر کوڈ کی تصدیق کے لیے یا 8100 پر ایس ایم ایس بھیجیں۔'

  // page.drawText(noteText, { x: 50, y: 20, font, fontSize, color: rgb(0, 0, 0) })

  // Save the PDF as a buffer
  const pdfBytes = await pdfDoc.save()

  // Trigger download or save to file as needed
  // (Use the appropriate method based on your frontend logic)
  // For example, you can return pdfBytes from your Netlify function.

  // Return the PDF as binary data
  return pdfBytes
}

const generateQRCodeImage = async data => {
  // Implement your QR code generation logic using a library of your choice
  // For example, you can use 'qrcode' library
  // Make sure to adapt this function based on your specific QR code generation code

  // Placeholder code for example:
  const qrCodeImage = await QRCode.toDataURL(data)

  return pdfDoc.embedPng(Buffer.from(qrCodeImage.split(',')[1], 'base64'))
}

export default async function handler(req, res) {
  try {
    // Get user data and data entries from the request or database
    const userData = {
      /* ... */
    }

    const dataEntries = [
      { key: 'Field1', value: 'Value1' },
      { key: 'Field2', value: 'Value2' }
    ]

    // Generate PDF
    const pdfBytes = await generatePdf(userData, dataEntries)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename=student_form.pdf')

    // Return the PDF as binary data
    res.status(200).send(pdfBytes)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: error.message })
  }
}
