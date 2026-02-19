import { LoadingButton } from '@mui/lab'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import converter from 'number-to-words'
import { use, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import supabase from 'src/configs/supabase'
import { useBoolean } from 'src/hooks/use-boolean'
import { fDate } from 'src/utils/format-time'
import uuidv4 from 'src/utils/uuidv4'

function generateRandomId() {
  const uuid = uuidv4()

  // Extracting a fixed 16-character substring from the UUID
  const shortId = uuid.replace(/-/g, '').substring(0, 16).toUpperCase()

  return `PB-VHR-${shortId}`
}

const SecondPage = () => {
  const query = useRouter()
  const edit_id = query.query.edit_id
  console.log('🚀 ~ SecondPage ~ edit_id:', edit_id)
  const isLoading = useBoolean()

  const currentDate = new Date()
  const futureDate = new Date(currentDate)
  futureDate.setDate(currentDate.getDate() + 7)

  const [formData, setFormData] = useState({
    issueDate: fDate(currentDate, 'yyyy-MM-dd'),
    recordType: '',
    typeAmount: '',
    validity: '',
    description: '',
    reason: '',
    applicantName: '',
    vendorInformation: '',
    checkbox: '',
    agent: '',
    address: '',
    userName: '',
    autoId: generateRandomId()
  })
  console.log('🚀 ~ SecondPage ~ formData:', formData)

  const handleChange = e => {
    const { name, value } = e.target

    // const formattedValue = name === 'issueDate' || name === 'validity' ? new Date(value).toUTCString() : value
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    isLoading.onTrue()
    const amountInWords = converter.toWords(formData.typeAmount)

    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = formData.issueDate.split('-').map(Number)

    // Create baseDate using selected date + current local time
    const baseDate = new Date(year, month - 1, day)
    const now = new Date()
    baseDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

    // Create futureDate by adding 7 days
    const futureDate = new Date(baseDate)
    futureDate.setDate(futureDate.getDate() + 7)

    if (edit_id) {
      const { data, error } = await supabase
        .from('forms')
        .update({
          amountInWords: amountInWords,
          issue_date: baseDate.toUTCString(),
          recordType: formData.recordType,
          type_amount: formData.typeAmount,
          validity: futureDate.toUTCString(),
          description: formData.description,
          reason: formData.reason,
          applicant_name: formData.applicantName,
          vendor_information: formData.vendorInformation,
          checkbox: formData.checkbox,
          agent: formData.agent,
          address: formData.address,
          auto_id: formData.autoId,
          userName: formData.userName
        })
        .eq('auto_id', formData.autoId)
      if (error) {
        isLoading.onFalse()
        toast.error('Something went wrong ')
        console.error('Error inserting data:', error.message)
      } else {
        isLoading.onFalse()
        toast('Updated 👍🏻')
        console.log('Form data inserted successfully:', data)
      }
    } else {
      // Insert form data into the Supabase table
      const { data, error } = await supabase.from('forms').upsert([
        {
          amountInWords: amountInWords,
          issue_date: baseDate.toUTCString(),
          recordType: formData.recordType,
          type_amount: formData.typeAmount,
          validity: futureDate.toUTCString(),
          description: formData.description,
          reason: formData.reason,
          applicant_name: formData.applicantName,
          vendor_information: formData.vendorInformation,
          checkbox: formData.checkbox,
          agent: formData.agent,
          address: formData.address,
          auto_id: formData.autoId,
          userName: formData.userName
        }
      ])

      // 1. Get current value
      const { data: statData } = await supabase
        .from('statistics')
        .select('metric_value')
        .eq('metric_name', 'total_forms')
        .single()

      // 2. Update with new value
      const { error: updateerror } = await supabase
        .from('statistics')
        .update({ metric_value: statData.metric_value + 1 })
        .eq('metric_name', 'total_forms')

      if (error) {
        isLoading.onFalse()
        toast.error('Something went wrong ')
        console.error('Error inserting data:', error.message)
      } else {
        isLoading.onFalse()
        setFormData({
          issueDate: '',
          typeAmount: '',
          validity: '',
          description: '',
          reason: '',
          recordType: '',
          applicantName: '',
          vendorInformation: '',
          checkbox: '',
          agent: '',
          address: '',
          userName: '',
          autoId: generateRandomId()
        })
        toast('Created 👍🏻')
        console.log('Form data inserted successfully:', data)
      }
    }
  }

  useEffect(() => {
    if (edit_id) {
      const fetchRecord = async () => {
        const { data, error } = await supabase.from('forms').select('*').eq('auto_id', edit_id).single()

        if (error) {
          console.error('Error fetching record:', error.message)
        } else {
          setFormData({
            issueDate: fDate(data.issue_date, 'yyyy-MM-dd'),
            recordType: data.recordType,
            typeAmount: Number(data.type_amount),
            validity: data.validity,
            description: data.description,
            reason: data.reason,
            applicantName: data.applicant_name,
            vendorInformation: data.vendor_information,
            checkbox: data.checkbox,
            agent: data.agent,
            address: data.address,
            userName: data.userName,
            autoId: data.auto_id
          })
        }
      }

      fetchRecord()
    }
  }, [edit_id])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌' />
          <CardContent>
            <Typography sx={{ mb: 2 }}>{edit_id ? 'Edit Record' : 'Add New Records'}.</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Form Section' />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField label='ID' name='autoId' value={formData.autoId} InputProps={{ readOnly: true }} />
                <TextField
                  label='Issue Date'
                  type='date'
                  name='issueDate'
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label='Type Amount'
                  type='number'
                  name='typeAmount'
                  value={formData.typeAmount}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label='Type'
                  name='recordType'
                  value={formData.recordType}
                  onChange={handleChange}
                  required
                />
                {/* <TextField
                  label='Validity'
                  name='validity'
                  type='date'
                  value={formData.validity}
                  onChange={handleChange}
                  required
                /> */}
                <TextField
                  label='Description'
                  name='description'
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <TextField label='Reason' name='reason' value={formData.reason} onChange={handleChange} required />
                <TextField
                  label='Applicant Name'
                  name='applicantName'
                  value={formData.applicantName}
                  onChange={handleChange}
                  required
                />

                <TextField
                  label='Vendor Information'
                  name='vendorInformation'
                  value={formData.vendorInformation}
                  onChange={handleChange}
                  required
                />

                <TextField label='Agent' name='agent' value={formData.agent} onChange={handleChange} required />
                <Select
                  label='Checkbox (S/O, W/O, D/O)'
                  name='checkbox'
                  value={formData.checkbox}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value='S/O'>S/O</MenuItem>
                  <MenuItem value='W/O'>W/O</MenuItem>
                  <MenuItem value='D/O'>D/O</MenuItem>
                </Select>
                <TextField label='User Name' name='userName' value={formData.userName} onChange={handleChange} />

                <TextField label='Address' name='address' value={formData.address} onChange={handleChange} required />

                <LoadingButton loading={isLoading.value} type='submit' variant='contained'>
                  {edit_id ? 'Update' : 'Create'}
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

SecondPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default SecondPage
