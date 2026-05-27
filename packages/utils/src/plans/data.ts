export default {
  BASIC: {
    NAME: 'Student',
    DESCRIPTION:
      'For ages 13 to 17. A parent or guardian creates the account and adds the student. The student learns at their own pace.',
    PRICE: {
      CURRENCY: '$',
      MONTHLY: '19.99',
      YEARLY: '199.90',
      IS_PREMIUM: false
    },
    FEATURES: [
      'For students ages 13 to 17',
      'Parent or guardian signs up first',
      'Full PathWorks module library',
      'Untimed lessons, save and resume',
      'No autoplay, content warnings on sensitive topics',
      'Module completion emails to parent',
      'Email support',
      'Cancel anytime'
    ],
    CTA: {
      LABEL: 'Sign up as a parent',
      LINK: '/signup?role=parent',
      DASHBOARD_LABEL: 'Subscribe',
      DASHBOARD_LINK: '',
      IS_DISABLED: false
    }
  },
  EARLY_ADOPTER: {
    NAME: 'Adult',
    DESCRIPTION: 'For self-directed learners age 18 and over. Sign up for yourself, no parent or counselor required.',
    PRICE: {
      CURRENCY: '$',
      MONTHLY: '39.99',
      YEARLY: '399.90',
      IS_PREMIUM: false
    },
    FEATURES: [
      'For ages 18 and over',
      'Self-signup, no parent required',
      'Everything in Student',
      'Adult-focused modules: workplace negotiation, asking for accommodations, professional communication',
      'Career-planning prompts and self-advocacy practice',
      'Priority email support',
      'Cancel anytime'
    ],
    CTA: {
      LABEL: 'Sign up',
      LINK: '/signup?role=adult',
      DASHBOARD_LABEL: 'Upgrade',
      DASHBOARD_LINK: '',
      IS_DISABLED: false,
      PRODUCT_ID: '1e11ad75-c422-41c1-a541-0e989281276c',
      PRODUCT_ID_YEARLY: 'a84d3a82-3259-4300-b2bf-dccb7bd7814c'
    }
  },
  ENTERPRISE: {
    NAME: 'VR Counselor & Agency',
    DESCRIPTION: 'For vocational rehabilitation counselors and state agencies enrolling participants on IPE plans.',
    PRICE: {
      CURRENCY: '',
      MONTHLY: 'Contact us',
      YEARLY: 'Contact us',
      IS_PREMIUM: true
    },
    FEATURES: [
      'Bulk participant seats (5 or more)',
      'Upload IPE / approval documentation per participant',
      'Add participant contact information at enrollment',
      'Counselor dashboard with per-participant progress',
      'WIOA Pre-ETS reporting and completion evidence',
      'WCAG 2.1 AA conformance statement (VPAT)',
      'SSO and admin controls',
      'BAA and DPA available',
      'Dedicated success manager'
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
