// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import MuiCardContent from '@mui/material/CardContent'

// ** Third Party Imports
import axios from 'axios'

// ** Demo Imports
import PricingCTA from 'src/views/pages/pricing/PricingCTA'
import PricingTable from 'src/views/pages/pricing/PricingTable'
import PricingPlans from 'src/views/pages/pricing/PricingPlans'
import PricingHeader from 'src/views/pages/pricing/PricingHeader'
import PricingFooter from 'src/views/pages/pricing/PricingFooter'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const CardContent = styled(MuiCardContent)(({ theme }) => ({
  padding: `${theme.spacing(20, 36)} !important`,
  [theme.breakpoints.down('xl')]: {
    padding: `${theme.spacing(20)} !important`
  },
  [theme.breakpoints.down('sm')]: {
    padding: `${theme.spacing(10, 5)} !important`
  }
}))

const Plans = ({ apiData }) => {
  const { user } = useAuth()

  // ** States
  const [plan, setPlan] = useState('monthly')

  const handleChange = e => {
    if (e.target.checked) {
      setPlan('annually')
    } else {
      setPlan('monthly')
    }
  }

  return (
    <Card>
      <CardContent>
        <PricingHeader plan={plan} handleChange={handleChange} />
        <PricingPlans plan={plan} data={apiData.pricingPlans} />
      </CardContent>
      {/* <PricingCTA /> */}
      {/* <CardContent>
        <PricingTable data={apiData} />
      </CardContent> */}
      {/* <CardContent sx={{ backgroundColor: 'action.hover' }}>
        <PricingFooter data={apiData} />
      </CardContent> */}
    </Card>
  )
}

export const getStaticProps = async () => {
  // const res = await axios.get('http://localhost:3000/api/pages/pricing')
  const apiData = {
    pricingPlans: [
      {
        imgWidth: 100,
        title: 'Basic',
        imgHeight: 100,
        monthlyPrice: '10 - 100',
        currentPlan: true,
        popularPlan: false,
        subtitle: 'A simple start for everyone',
        imgSrc: '/images/pages/pricing-plan-basic.png',
        yearlyPlan: {
          perMonth: 50,
          totalAnnual: 48
        },
        planBenefits: ['30 Days', '20% profit daily ', '600% profit monthly']
      },
      {
        imgWidth: 100,
        imgHeight: 100,
        monthlyPrice: '100 - 500',
        title: 'Standard',
        popularPlan: true,
        currentPlan: false,
        subtitle: 'For small to medium businesses',
        imgSrc: '/images/pages/pricing-plan-enterprise.png',
        yearlyPlan: {
          perMonth: 500,
          totalAnnual: 480
        },
        planBenefits: ['30 Days', '20% profit daily ', '600% profit monthly']
      },
      {
        imgWidth: 100,
        imgHeight: 100,
        monthlyPrice: '500 - 1000',
        popularPlan: false,
        currentPlan: false,
        title: 'Enterprise',
        subtitle: 'Solution for big organizations',
        imgSrc: '/images/pages/pricing-plan-standard.png',
        yearlyPlan: {
          perMonth: 1000,
          totalAnnual: 960
        },
        planBenefits: ['30 Days', '20% profit daily ', '600% profit monthly']
      }
    ]

    //   faq: [
    //     {
    //       id: 'responses-limit',
    //       question: 'What counts towards the 100 responses limit?',
    //       answer:
    //         'We count all responses submitted through all your forms in a month. If you already received 100 responses this month, you won’t be able to receive any more of them until next month when the counter resets.'
    //     },
    //     {
    //       id: 'process-payments',
    //       question: 'How do you process payments?',
    //       answer:
    //         'We accept Visa®, MasterCard®, American Express®, and PayPal®. So you can be confident that your credit card information will be kept safe and secure.'
    //     },
    //     {
    //       id: 'payment-methods',
    //       question: 'What payment methods do you accept?',
    //       answer: '2Checkout accepts all types of credit and debit cards.'
    //     },
    //     {
    //       id: 'money-back-guarantee',
    //       question: 'Do you have a money-back guarantee?',
    //       answer: 'Yes. You may request a refund within 30 days of your purchase without any additional explanations.'
    //     },
    //     {
    //       id: 'more-questions',
    //       question: 'I have more questions. Where can I get help?',
    //       answer: 'Please contact us if you have any other questions or concerns. We’re here to help!'
    //     }
    //   ],
    //   pricingTable: {
    //     header: [
    //       {
    //         title: 'Features',
    //         subtitle: 'Native Front Features'
    //       },
    //       {
    //         title: 'Starter',
    //         subtitle: 'Free'
    //       },
    //       {
    //         isPro: true,
    //         title: 'Pro',
    //         subtitle: '$7.5/month'
    //       },
    //       {
    //         title: 'Enterprise',
    //         subtitle: '$16/month'
    //       }
    //     ],
    //     rows: [
    //       {
    //         pro: true,
    //         starter: true,
    //         enterprise: true,
    //         feature: '14-days free trial'
    //       },
    //       {
    //         pro: false,
    //         starter: false,
    //         enterprise: true,
    //         feature: 'No user limit'
    //       },
    //       {
    //         pro: true,
    //         starter: false,
    //         enterprise: true,
    //         feature: 'Product Support'
    //       },
    //       {
    //         starter: false,
    //         enterprise: true,
    //         pro: 'Add-On Available',
    //         feature: 'Email Support'
    //       },
    //       {
    //         pro: true,
    //         starter: false,
    //         enterprise: true,
    //         feature: 'Integrations'
    //       },
    //       {
    //         starter: false,
    //         enterprise: true,
    //         pro: 'Add-On Available',
    //         feature: 'Removal of Front branding'
    //       },
    //       {
    //         pro: false,
    //         starter: false,
    //         enterprise: true,
    //         feature: 'Active maintenance & support'
    //       },
    //       {
    //         pro: false,
    //         starter: false,
    //         enterprise: true,
    //         feature: 'Data storage for 365 days'
    //       }
    //     ]
    //   }
  }

  return {
    props: {
      apiData
    }
  }
}

Plans.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Plans
