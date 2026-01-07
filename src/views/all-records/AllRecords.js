// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'
import supabase from 'src/configs/supabase'
import { useEffect, useState } from 'react'
import { fDate } from 'src/utils/format-time'
import { Button, IconButton } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { addDays } from 'date-fns'
import Link from 'next/link'

const statusObj = {
  true: { color: 'success', text: 'Approved' },
  false: { color: 'warning', text: 'Rejected' },
  null: { color: 'primary', text: 'Pending' }
}

const AllRecords = () => {
  const [rows, setRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [totalCount, setTotalCount] = useState(0)

  const columns = [
    {
      flex: 0.25,
      field: 'issue_date',
      minWidth: 200,
      headerName: 'Date',
      renderCell: ({ row }) => {
        return <Box sx={{ display: 'flex', alignItems: 'center' }}>{fDate(row.issue_date)}</Box>
      }
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'auto_id',
      headerName: 'Stamp ID',
      renderCell: ({ row }) => <Typography variant='body2'>{row?.auto_id}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 300,
      field: 'applicant_name',
      headerName: 'Applicant Name',
      renderCell: ({ row }) => <Typography variant='body2'>{row?.applicant_name}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 150,
      field: 'type_amount',
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>{row.type_amount || 0}</Typography>
    },

    {
      flex: 0.2,
      minWidth: 130,
      field: 'validity',
      headerName: 'Validity',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{fDate(row.validity)}</Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 200,
      field: 'Action',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant='contained' component={Link} href={`/e-stamp-information/${row?.auto_id}`}>
            View
          </Button>
          <Button variant='outlined' component={Link} href={`/add-new/?edit_id=${row?.auto_id}`}>
            Edit
          </Button>
        </Box>
      )
    }
  ]

  // *** HANDLE GET REQUEST
  const getWithdraws = async () => {
    try {
      let { data: deposits, error } = await supabase.from('forms').select('*').order('created_at', { ascending: false })
      let { data: total_forms, error: totalCountError } = await supabase.from('statistics').select('*').single()
      console.log('🚀 ~ getWithdraws ~ totalCountData:', total_forms)

      if (error || totalCountError) {
        console.log('🚀 ~ getWithdraws ~ error:', error)
        return
      }

      setRows(deposits)
      setTotalCount(total_forms?.metric_value || 0)

      // Save total count to database
      // await saveTotalCount(totalCountData?.length || 0)
    } catch (error) {
      console.log('🚀 ~ getWithdraws ~ error:', error)
    }
  }

  // *** SAVE TOTAL COUNT TO DATABASE
  const saveTotalCount = async count => {
    try {
      const { data, error } = await supabase
        .from('statistics')
        .upsert(
          { metric_name: 'total_forms', metric_value: count, updated_at: new Date().toISOString() },
          { onConflict: 'metric_name' }
        )

      if (error) {
        console.log('🚀 ~ saveTotalCount ~ error:', error)
      }
    } catch (error) {
      console.log('🚀 ~ saveTotalCount ~ error:', error)
    }
  }

  // STATES
  useEffect(() => {
    getWithdraws()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={6} md={3}>
        <CardStatsVertical
          stats={totalCount.toLocaleString()}
          color='primary'
          trendNumber=''
          title='Total Forms'
          chipText='Last Updated'
          icon={<Icon icon='mdi:file-document-multiple-outline' />}
        />
      </Grid>
      <Grid item xs={12}>
        <Card>
          <DataGrid
            autoHeight
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            loading={!rows.length}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default AllRecords
