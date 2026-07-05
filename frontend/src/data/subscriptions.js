export const subscriptionPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 'Free',
    priceDetail: 'Forever',
    description: 'Perfect for trying out the platform',
    features: [
      { text: 'Max 2 Events', included: true },
      { text: 'Basic Dashboard', included: true },
      { text: 'Community Support', included: true },
      { text: 'Advanced Analytics', included: false },
      { text: 'Priority Support', included: false }
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    id: 'pro',
    name: 'Organizer Pro',
    price: '0.1 ETH',
    priceDetail: 'per month',
    description: 'For serious event organizers',
    features: [
      { text: 'Unlimited Events', included: true },
      { text: 'Advanced Analytics', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Unlimited Ticket Verification', included: true },
      { text: 'Custom Branding', included: true }
    ],
    cta: 'Upgrade Now',
    highlighted: true
  }
];
