// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'

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
      minWidth: 250,
      field: 'applicant_name',
      headerName: 'Applicant Name',
      renderCell: ({ row }) => <Typography variant='body2'>{row?.applicant_name}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 250,
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

      console.log('🚀 ~ getWithdraws ~ data:', deposits)

      setRows(deposits)
    } catch (error) {
      console.log('🚀 ~ getWithdraws ~ error:', error)
    }
  }

  // STATES
  useEffect(() => {
    getWithdraws()
  }, [])

  return (
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
  )
}

export default AllRecords
