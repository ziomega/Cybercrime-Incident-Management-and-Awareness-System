// Mock unassigned cases
export const mockUnassignedCases = [
  {
    id: 1,
    description: 'Phishing email received claiming to be from bank. Email contains suspicious links requesting personal information and account credentials.',
    status: 'in_progress',
    reported_at: '2025-01-08T10:30:00Z',
    reported_by: 'john.doe@example.com',
    location: '123 Main St, New York, NY 10001',
    crime_type: 'Phishing',
    priority: 'high'
  },
  {
    id: 5,
    description: 'Online shopping fraud - paid for items that never arrived. Seller has disappeared and website is now offline.',
    status: 'in_progress',
    reported_at: '2025-01-08T11:30:00Z',
    reported_by: 'david.brown@example.com',
    location: '654 Elm Road, Phoenix, AZ 85001',
    crime_type: 'E-commerce Fraud',
    priority: 'medium'
  },
  {
    id: 8,
    description: 'Cyberbullying and harassment through multiple social media platforms. Threatening messages and personal information shared publicly.',
    status: 'in_progress',
    reported_at: '2025-01-08T15:00:00Z',
    reported_by: 'jennifer.white@example.com',
    location: '258 Valley View, Seattle, WA 98101',
    crime_type: 'Cyberbullying',
    priority: 'high'
  },
  {
    id: 11,
    description: 'Fake investment scheme detected on social media. Multiple victims reporting significant financial losses.',
    status: 'in_progress',
    reported_at: '2025-01-08T09:15:00Z',
    reported_by: 'alex.martinez@example.com',
    location: '789 Broadway, San Diego, CA 92101',
    crime_type: 'Investment Fraud',
    priority: 'high'
  },
  {
    id: 13,
    description: 'Unauthorized access to company email system. Suspicious login attempts from foreign IP addresses.',
    status: 'in_progress',
    reported_at: '2025-01-08T13:45:00Z',
    reported_by: 'corporate@techcorp.com',
    location: '456 Tech Park, Austin, TX 78701',
    crime_type: 'Unauthorized Access',
    priority: 'medium'
  },
  {
    id: 16,
    description: 'SMS phishing campaign targeting bank customers. Messages contain links to fake banking websites.',
    status: 'in_progress',
    reported_at: '2025-01-08T08:20:00Z',
    reported_by: 'security@bank.com',
    location: '321 Financial District, Charlotte, NC 28202',
    crime_type: 'SMS Phishing',
    priority: 'low'
  }
];

// Mock assigned cases for reassignment
export const mockAssignedCases = [
  {
    id: 2,
    description: 'Ransomware attack on company servers. All files have been encrypted and a ransom note demanding payment in cryptocurrency has been left.',
    status: 'assigned',
    reported_at: '2025-01-07T14:20:00Z',
    reported_by: 'sarah.wilson@example.com',
    location: '456 Business Ave, Los Angeles, CA 90012',
    crime_type: 'Ransomware',
    priority: 'high',
    assigned_to: {
      id: 2,
      name: 'Sarah Chen',
      department: 'Cyber Forensics'
    },
    assigned_at: '2025-01-07T15:00:00Z'
  },
  {
    id: 4,
    description: 'Social media account hacked. Unauthorized posts and messages sent to contacts asking for money transfers.',
    status: 'assigned',
    reported_at: '2025-01-06T16:45:00Z',
    reported_by: 'emma.davis@example.com',
    location: '321 Pine Street, Houston, TX 77001',
    crime_type: 'Account Takeover',
    priority: 'medium',
    assigned_to: {
      id: 6,
      name: 'Michael Roberts',
      department: 'Digital Crimes'
    },
    assigned_at: '2025-01-06T17:30:00Z'
  },
  {
    id: 7,
    description: 'Cryptocurrency wallet hacked. All digital assets transferred to unknown wallet address.',
    status: 'assigned',
    reported_at: '2025-01-07T13:20:00Z',
    reported_by: 'robert.taylor@example.com',
    location: '147 Crypto Lane, Miami, FL 33101',
    crime_type: 'Cryptocurrency Theft',
    priority: 'high',
    assigned_to: {
      id: 9,
      name: 'James Wilson',
      department: 'Cyber Intelligence'
    },
    assigned_at: '2025-01-07T14:00:00Z'
  },
  {
    id: 10,
    description: 'Malware infection on company network. Multiple computers showing unusual behavior and data exfiltration suspected.',
    status: 'assigned',
    reported_at: '2025-01-06T12:30:00Z',
    reported_by: 'patricia.garcia@example.com',
    location: '741 Industrial Way, Denver, CO 80201',
    crime_type: 'Malware',
    priority: 'high',
    assigned_to: {
      id: 11,
      name: 'Emily Parker',
      department: 'Cyber Forensics'
    },
    assigned_at: '2025-01-06T13:00:00Z'
  }
];

// Mock investigators
export const mockInvestigators = [
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@cybercrime.gov',
    department: 'Cyber Forensics',
    current_cases: 3,
    max_capacity: 5,
    success_rate: 75,
    avg_resolution_time: 4.5,
    specialization: ['Ransomware', 'Malware Analysis', 'Forensics', 'Phishing']
  },
  {
    id: 6,
    name: 'Michael Roberts',
    email: 'michael.roberts@cybercrime.gov',
    department: 'Digital Crimes',
    current_cases: 4,
    max_capacity: 5,
    success_rate: 73.3,
    avg_resolution_time: 3.8,
    specialization: ['Identity Theft', 'Account Security', 'Social Engineering', 'E-commerce Fraud']
  },
  {
    id: 9,
    name: 'James Wilson',
    email: 'james.wilson@cybercrime.gov',
    department: 'Cyber Intelligence',
    current_cases: 4,
    max_capacity: 6,
    success_rate: 77.8,
    avg_resolution_time: 5.2,
    specialization: ['Cryptocurrency', 'Financial Crimes', 'Blockchain Analysis', 'Investment Fraud']
  },
  {
    id: 11,
    name: 'Emily Parker',
    email: 'emily.parker@cybercrime.gov',
    department: 'Cyber Forensics',
    current_cases: 3,
    max_capacity: 5,
    success_rate: 70,
    avg_resolution_time: 4.1,
    specialization: ['Malware Analysis', 'Network Security', 'Incident Response', 'Unauthorized Access']
  },
  {
    id: 14,
    name: 'David Thompson',
    email: 'david.thompson@cybercrime.gov',
    department: 'Digital Crimes',
    current_cases: 2,
    max_capacity: 4,
    success_rate: 62.5,
    avg_resolution_time: 6.3,
    specialization: ['E-commerce Fraud', 'Consumer Protection', 'Scam Investigation', 'Cyberbullying']
  }
];
