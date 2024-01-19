import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import supabase from 'src/configs/supabase'
import toast from 'react-hot-toast'
import { useBoolean } from 'src/hooks/use-boolean'
import { LoadingButton } from '@mui/lab'

const generateAutoId = () => {
  const randomId = Math.floor(Math.random() * 90000) + 10000

  return `PB-VHR-${randomId}`
}

const SecondPage = () => {
  const isLoading = useBoolean()

  const [formData, setFormData] = useState({
    issueDate: '',
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
    autoId: generateAutoId()
  })

  const handleChange = e => {
    const { name, value } = e.target

    const formattedValue = name === 'issueDate' || name === 'validity' ? new Date(value).toUTCString() : value
    setFormData(prevData => ({
      ...prevData,
      [name]: formattedValue
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    isLoading.onTrue()

    // Insert form data into the Supabase table
    const { data, error } = await supabase.from('forms').upsert([
      {
        issue_date: formData.issueDate,
        recordType: formData.recordType,
        type_amount: formData.typeAmount,
        validity: formData.validity,
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
        autoId: generateAutoId()
      })
      toast('Created 👍🏻')
      console.log('Form data inserted successfully:', data)
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌' />
          <CardContent>
            <Typography sx={{ mb: 2 }}>Add New Records.</Typography>
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
                  type='number'
                  name='recordType'
                  value={formData.recordType}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label='Validity'
                  name='validity'
                  type='date'
                  value={formData.validity}
                  onChange={handleChange}
                  required
                />
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
                  Submit
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
