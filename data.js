// Enhanced Election Data with Voting
const electionData = {
    totalVotes: 8425691,
    turnout: 67.8,
    precinctsReporting: 94,
    remainingPrecincts: 312,
    onlineVotes: 124589,
    
    candidates: [
        {
            id: "candidate-1",
            name: "Alexandra Chen",
            party: "Democrat",
            initials: "AC",
            color: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            votes: 4256891,
            platform: "Education reform, Climate action, Healthcare access",
            tagline: "A Future for Everyone"
        },
        {
            id: "candidate-2",
            name: "Marcus Johnson",
            party: "Republican",
            initials: "MJ",
            color: "linear-gradient(135deg, #ef4444, #dc2626)",
            votes: 3965210,
            platform: "Economic growth, Border security, Tax reduction",
            tagline: "Stronger Together"
        },
        {
            id: "candidate-3",
            name: "Sarah Williams",
            party: "Independent",
            initials: "SW",
            color: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
            votes: 203590,
            platform: "Political reform, Digital privacy, Infrastructure",
            tagline: "New Vision, Real Change"
        }
    ],
    
    updates: [
        {
            time: "14:30",
            text: "Large precinct in Los Angeles County just reported"
        },
        {
            time: "14:15",
            text: "Mail-in ballots being processed in Maricopa County"
        },
        {
            time: "14:00",
            text: "Record voter turnout reported in Texas"
        },
        {
            time: "13:45",
            text: "New results show swing state Ohio leaning Republican"
        },
        {
            time: "13:30",
            text: "Early voting patterns suggest high youth turnout"
        }
    ]
};

// Voter Database
const voterDatabase = {
    'ABC123456789': {
        name: 'Alex Johnson',
        district: 'District 7',
        hasVoted: false,
        pin: '123456'
    },
    'DEF987654321': {
        name: 'Maria Garcia',
        district: 'District 3',
        hasVoted: false,
        pin: '654321'
    },
    'GHI456123789': {
        name: 'Robert Chen',
        district: 'District 12',
        hasVoted: false,
        pin: '789123'
    },
    'JKL789456123': {
        name: 'Sarah Miller',
        district: 'District 5',
        hasVoted: false,
        pin: '456123'
    },
    'MNO123789456': {
        name: 'James Wilson',
        district: 'District 9',
        hasVoted: false,
        pin: '321654'
    }
};