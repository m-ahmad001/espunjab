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

const statusObj = {
  true: { color: 'success', text: 'Approved' },
  false: { color: 'warning', text: 'Rejected' },
  null: { color: 'primary', text: 'Pending' }
}

const AllUsers = () => {
  const [rows, setRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const columns = [
    {
      flex: 0.25,
      field: 'created_at',
      minWidth: 200,
      headerName: 'Date',
      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {fDate(row.created_at)}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
                {row.name}
              </Typography>
              <Typography variant='caption' sx={{ lineHeight: 1.6667 }}>
                {row.username}
              </Typography> */}
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
            {row.email}
          </Typography>
          <Typography variant='caption' sx={{ lineHeight: 1.6667 }}>
            {row?.username}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'firstName',
      headerName: 'Full Name',
      renderCell: ({ row }) => <Typography variant='body2'>{`${row.firstName} ${row.lastName}`}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'ip',
      headerName: 'Location',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row.ip.city}</Typography>

          <Typography sx={{ color: 'text.secondary' }}>{row.ip.countryName}</Typography>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'plans',
      headerName: 'Plans',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.plans?.length || 0}
          </Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'balance',
      headerName: 'Balance',
      renderCell: ({ row }) => (
        <CustomChip
          skin='light'
          size='small'
          label={`$ ${row?.balance || 0}`}
          color={'success'}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { px: 2.5, lineHeight: 1.385 } }}
        />
      )
    }
  ]

  // *** HANDLE APPROVED
  const currentDate = new Date()
  const sevenDaysFromNow = addDays(currentDate, 7)

  const handleApproved = async row => {
    console.log('🚀 ~ handleApproved ~ row:', row)

    try {
      toast.loading('Saving...')

      await supabase.from('withdraws').update({ approved: true }).eq('id', row.id)
      const newBalance = row.users.balance - row.amount

      // Insert a log entry
      await supabase.from('logs').insert([{ user_id: row.user_id, balance: row.amount, type: 'withdrawa Approved' }])
      toast.dismiss()

      getWithdraws()
      toast.success('Approved!')
    } catch (error) {
      toast.dismiss()
      toast.error(error.message)
      console.error('🚀 ~ handleApproved ~ error:', error)
    }
  }

  // *** HANDLE REJECT
  const handleReject = async row => {
    try {
      toast.loading('Saving...')
      const newBalance = row.users.balance + row.amount

      let { data: dep, error: depError } = await supabase
        .from('withdraws')
        .update({ approved: false }) // Replace with the field you want to update
        .eq('id', row.id)

      await supabase
        .from('users')
        .update({ balance: newBalance }) // Replace with the field you want to update
        .eq('id', row.users.id)

      const { data, error } = await supabase
        .from('logs')
        .insert([
          { user_id: row.user_id, balance: row.amount, plan_id: row?.plan_id || '_', type: 'withdraw rejected' }
        ])

      toast.dismiss()
      if (depError || error) {
        toast.error('Could not Reject.')
      } else {
        getWithdraws()
        toast.success('Rejected !')
      }
    } catch (error) {
      console.log('🚀 ~ handleApproved ~ error:', error)
    }
  }

  // *** HANDLE GET REQUEST
  const getWithdraws = async () => {
    try {
      let { data: deposits, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })

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

export default AllUsers
