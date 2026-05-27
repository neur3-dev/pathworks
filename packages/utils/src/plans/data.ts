export default {
  BASIC: {
    NAME: 'Solo',
    DESCRIPTION: 'One participant seat. For a parent or individual counselor buying for a single student.',
    PRICE: {
      CURRENCY: '$',
      MONTHLY: '39',
      YEARLY: '390',
      IS_PREMIUM: false
    },
    FEATURES: [
      '1 participant seat',
      'Full PathWorks module library',
      'Untimed lessons, save and resume',
      'Content warnings on sensitive topics',
      'Email support',
      'Cancel anytime'
    ],
    CTA: {
      LABEL: 'Buy a seat',
      LINK: '/signup?plan=solo',
      DASHBOARD_LABEL: 'Subscribe',
      DASHBOARD_LINK: '',
      IS_DISABLED: false
    }
  },
  EARLY_ADOPTER: {
    NAME: 'Cohort',
    DESCRIPTION: 'Five to twenty-five participant seats at $29 per seat per month. For counselors with a caseload.',
    PRICE: {
      CURRENCY: '$',
      MONTHLY: '29',
      YEARLY: '290',
      IS_PREMIUM: false
    },
    FEATURES: [
      'Everything in Solo',
      '5 to 25 participant seats',
      'Add or remove seats anytime',
      'Counselor dashboard with progress export',
      'WIOA-aligned completion evidence',
      'Priority email support'
    ],
    CTA: {
      LABEL: 'Buy seats',
      LINK: '/signup?plan=cohort',
      DASHBOARD_LABEL: 'Upgrade',
      DASHBOARD_LINK: '',
      IS_DISABLED: false,
      PRODUCT_ID: '1e11ad75-c422-41c1-a541-0e989281276c',
      PRODUCT_ID_YEARLY: 'a84d3a82-3259-4300-b2bf-dccb7bd7814c'
    }
  },
  ENTERPRISE: {
    NAME: 'Agency',
    DESCRIPTION:
      'For state VR agencies and large programs. Twenty-six or more participants, with the controls procurement needs.',
    PRICE: {
      CURRENCY: '',
      MONTHLY: 'Request Pricing',
      YEARLY: 'Request Pricing',
      IS_PREMIUM: true
    },
    FEATURES: [
      'Everything in Cohort',
      'Unlimited participant seats',
      'SSO and admin controls',
      'Custom reporting and integrations',
      'BAA and DPA available',
      'Dedicated success manager',
      'WCAG 2.1 AA conformance statement (VPAT)'
    ],
    CTA: {
      LABEL: 'Contact us',
      LINK: 'https://cal.com/pathworks/enterprise',
      DASHBOARD_LABEL: 'Contact us',
      DASHBOARD_LINK: 'https://cal.com/pathworks/enterprise',
      IS_DISABLED: false
    }
  }
};
