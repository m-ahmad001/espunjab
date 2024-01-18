/* eslint-disable react-hooks/exhaustive-deps */
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
import { useAuth } from 'src/hooks/useAuth'

const statusObj = {
  deposit: { color: 'success', text: 'Deposit' },
  'deposit rejected': { color: 'warning', text: 'Deposit Rejected' },
  'withdraw request': { color: 'info', text: 'Withdraw Request - Pending' },
  'withdraw request': { color: 'info', text: 'Withdraw Request - Pending' },
  'daily profit': { color: 'primary', text: 'Daily Profit' }
}

const TransactionsTable = () => {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const columns = [
    {
      flex: 0.25,
      field: 'created_at',
      minWidth: 200,
      headerName: 'Request Date',
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
      field: 'balance',
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>${row.balance || 0}</Typography>
    },

    {
      flex: 0.2,
      minWidth: 130,
      field: 'plan_id',
      headerName: 'Plan Name',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row.plan_id}</Typography>
        </Box>
      )
    },
    {
      flex: 0.15,
      minWidth: 110,
      field: 'type',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          skin='light'
          size='small'
          label={row?.type}
          color='success'
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { px: 2.5, lineHeight: 1.385 } }}
        />
      )
    }
  ]

  // *** HANDLE GET REQUEST
  const getDeposits = async () => {
    try {
      let { data: deposits, error } = await supabase
        .from('logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('🚀 ~ getDeposits ~ data:', deposits)

      setRows(deposits)
    } catch (error) {
      console.log('🚀 ~ getDeposits ~ error:', error)
    }
  }

  // STATES
  useEffect(() => {
    getDeposits()
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

export default TransactionsTable
