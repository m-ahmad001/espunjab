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
import { useBoolean } from 'src/hooks/use-boolean'
import LoadingSpinner from 'src/@core/components/loading-spinner'

const statusObj = {
  true: { color: 'success', text: 'Approved' },
  false: { color: 'warning', text: 'Rejected' },
  null: { color: 'primary', text: 'Pending' }
}

const DepositTable = () => {
  const [rows, setRows] = useState([])
  const isLoading = useBoolean(false)
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
      field: 'email',
      headerName: 'Email',
      renderCell: ({ row }) => <Typography variant='body2'>{row.email}</Typography>
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }) => <Typography variant='body2'>${row.amount || 0}</Typography>
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'transactionId',
      headerName: 'Transaction Id',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>{row.transactionId}</Typography>
        </Box>
      )
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
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <CustomChip
          skin='light'
          size='small'
          label={statusObj[row.approved].text}
          color={statusObj[row.approved].color}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { px: 2.5, lineHeight: 1.385 } }}
        />
      )
    },
    {
      flex: 0.125,
      minWidth: 140,
      field: 'approved',
      headerName: 'Actions',
      renderCell: params => {
        return (
          <>
            <IconButton
              disabled={params.row.approved !== null || isLoading.value}
              size='small'
              variant='outlined'
              color='secondary'
              onClick={() => handleApproved(params.row)}
            >
              <IconifyIcon icon='entypo:check' color='#72E128' />
            </IconButton>
            <IconButton
              disabled={params.row.approved !== null || isLoading.value}
              size='small'
              variant='outlined'
              color='secondary'
              onClick={() => handleReject(params.row)}
            >
              <IconifyIcon icon='fluent:delete-24-regular' color='#BF3131' />
            </IconButton>
          </>
        )
      }
    }
  ]

  // *** HANDLE APPROVED
  const currentDate = new Date()
  const thirtyDaysFromNow = addDays(currentDate, 30)

  const handleApproved = async row => {
    isLoading.onTrue()
    toast.loading('Saving...')

    try {
      let { data: dep, error: depError } = await supabase
        .from('deposits')
        .update({ approved: true }) // Replace with the field you want to update
        .eq('id', row.id)

      // Define the profit commission rate (10%)
      const commissionRate = 0.1

      // Check if the user has a referrer
      const { data: user } = await supabase.from('users').select('*').eq('id', row.users.reffer_id).single()

      if (user) {
        // Check if the user has already received the commission
        const { data: commissionLogs } = await supabase
          .from('logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'refferal commission')

        if (commissionLogs.length === 0) {
          // User hasn't received the commission, calculate and add it
          const commissionAmount = row.amount * commissionRate

          // Insert commission log entry
          await supabase.from('logs').insert([
            {
              user_id: user.id,
              balance: commissionAmount,
              type: 'refferal commission'
            }
          ])

          // Update the referrer's balance
          await supabase
            .from('users')
            .update({
              balance: user.balance + commissionAmount
            })
            .eq('id', user.id)
        }
      }

      // Update the user's balance with the deposit amount
      const updatedPlan = [
        ...row.users.plans,
        {
          amount: row.amount,
          plan_id: row.plan_id,
          expiration: thirtyDaysFromNow,
          expired: false
        }
      ]

      const { error: errr } = await supabase
        .from('users')
        .update({
          // balance: row.amount,
          plans: updatedPlan
        })
        .eq('id', row.user_id)
      console.log('🚀 ~ handleApproved ~ errr:', errr)

      // Insert deposit log entry
      await supabase.from('logs').insert([
        {
          user_id: row.user_id,
          balance: row.amount,
          plan_id: row.plan_id,
          type: 'deposit'
        }
      ])
      toast.dismiss()
      getDeposits()
      toast.success('Approved')
      console.log('Deposit and commission handled successfully.')
    } catch (error) {
      console.error('Error handling deposit and commission:', error)
    } finally {
      isLoading.onFalse()
    }
  }

  // *** HANDLE REJECT
  const handleReject = async row => {
    try {
      toast.loading('Saving...')

      let { data: dep, error: depError } = await supabase
        .from('deposits')
        .update({ approved: false }) // Replace with the field you want to update
        .eq('id', row.id)
        .single()

      const { data, error } = await supabase
        .from('logs')
        .insert([{ user_id: row.user_id, balance: row.amount, plan_id: row.plan_id, type: 'deposit rejected' }])
        .select()

      toast.dismiss()
      if (depError || error) {
        toast.error('Could not Reject.')
      } else {
        getDeposits()
        toast.success('Rejected !')
      }
    } catch (error) {
      console.log('🚀 ~ handleApproved ~ error:', error)
    }
  }

  // *** HANDLE GET REQUEST
  const getDeposits = async () => {
    try {
      let { data: deposits, error } = await supabase
        .from('deposits')
        .select('*,users(id,reffer_id,plans)')
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
      {isLoading.value && <LoadingSpinner />}
    </Card>
  )
}

export default DepositTable
