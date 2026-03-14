// Data Simulation and Application Logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-theme', this.checked);
        localStorage.setItem('theme', this.checked ? 'dark' : 'light');
    });
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        document.body.classList.add('dark-theme');
    }
    
    // Voting modal functionality
    const modal = document.getElementById('voting-modal');
    const voteNowBtn = document.getElementById('vote-now-btn');
    const closeModal = document.querySelector('.close-modal');
    
    // Open modal
    voteNowBtn.addEventListener('click', function() {
        modal.style.display = 'flex';
        resetVotingForm();
        loadVotingCandidates();
        updateVotingTimer();
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Verify voter ID
    document.getElementById('verify-voter').addEventListener('click', verifyVoter);
    
    // Submit vote
    document.getElementById('submit-vote').addEventListener('click', submitVote);
    
    // Refresh button functionality
    document.getElementById('refresh-btn').addEventListener('click', refreshData);
    
    // Initialize voting timer
    updateVotingTimer();
    setInterval(updateVotingTimer, 1000);
    
    // Simulate live updates
    setInterval(simulateLiveUpdate, 5000);
    
    // Load recent votes
    loadRecentVotes();
});

// Core Functions
function initializeApp() {
    updateCandidates();
    updateRecentUpdates();
    updateTime();
    updateStatistics();
    initializeStateHoverEffects();
}

function initializeStateHoverEffects() {
    const states = document.querySelectorAll('.state');
    states.forEach(state => {
        state.addEventListener('mouseenter', function() {
            const party = this.dataset.party;
            const partyNames = {
                'democrat': 'Democrat',
                'republican': 'Republican',
                'tossup': 'Toss Up'
            };
            
            const tooltip = document.createElement('div');
            tooltip.className = 'state-tooltip';
            tooltip.textContent = `${this.textContent} - ${partyNames[party]} Leading`;
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width/2 - tooltip.offsetWidth/2}px`;
            tooltip.style.top = `${rect.top - 30}px`;
            
            this.tooltip = tooltip;
        });
        
        state.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
            }
        });
    });
}

// Voting Functions
function verifyVoter() {
    const voterId = document.getElementById('voter-id').value.trim();
    const verifyBtn = document.getElementById('verify-voter');
    
    if (!isValidVoterId(voterId)) {
        showNotification('Please enter a valid 12-digit Voter ID (e.g., ABC123456789)', 'error');
        return;
    }
    
    // Check if already voted
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    if (votes.some(vote => vote.voterId === voterId)) {
        showNotification('This Voter ID has already voted', 'error');
        return;
    }
    
    // Simulate verification
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    verifyBtn.disabled = true;
    
    setTimeout(() => {
        if (voterDatabase[voterId]) {
            document.getElementById('voter-id-section').style.display = 'none';
            document.getElementById('voting-section').style.display = 'block';
            document.getElementById('verification-success').style.display = 'block';
            
            document.getElementById('voter-name').textContent = voterDatabase[voterId].name;
            
            setTimeout(() => {
                document.getElementById('verification-success').style.display = 'none';
            }, 2000);
        } else {
            showNotification('Voter ID not found in the system', 'error');
        }
        
        verifyBtn.innerHTML = '<i class="fas fa-check-circle"></i> Verify Voter ID';
        verifyBtn.disabled = false;
    }, 1000);
}

function submitVote() {
    const voterPin = document.getElementById('voter-pin').value.trim();
    const voterId = document.getElementById('voter-id').value.trim();
    const selectedCandidate = document.querySelector('.voting-candidate.selected');
    const submitBtn = document.getElementById('submit-vote');
    
    if (!selectedCandidate) {
        showNotification('Please select a candidate', 'error');
        return;
    }
    
    if (!isValidPin(voterPin)) {
        showNotification('Please enter a valid 6-digit PIN', 'error');
        return;
    }
    
    // Check PIN
    if (!voterDatabase[voterId] || voterDatabase[voterId].pin !== voterPin) {
        showNotification('Invalid PIN. Please try again.', 'error');
        return;
    }
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const candidateId = selectedCandidate.dataset.candidateId;
        const receiptId = 'VTX-' + Date.now().toString().slice(-6);
        const now = new Date();
        
        // Record vote
        const votes = JSON.parse(localStorage.getItem('votes') || '[]');
        votes.push({
            voterId,
            candidateId,
            timestamp: now.toISOString(),
            receiptId: receiptId
        });
        localStorage.setItem('votes', JSON.stringify(votes));
        
        // Update candidate votes
        const candidate = electionData.candidates.find(c => c.id === candidateId);
        if (candidate) {
            candidate.votes += 1;
            electionData.totalVotes += 1;
            electionData.onlineVotes += 1;
        }
        
        // Show success
        document.getElementById('voting-section').style.display = 'none';
        document.getElementById('voting-success').style.display = 'block';
        
        document.getElementById('receipt-id').textContent = receiptId;
        document.getElementById('receipt-time').textContent = now.toLocaleTimeString();
        
        // Update UI
        updateStatistics();
        updateCandidates();
        addRecentVote(candidateId, now.toLocaleTimeString());
        
        // Close modal after 3 seconds
        setTimeout(() => {
            document.getElementById('voting-modal').style.display = 'none';
            resetVotingForm();
            showNotification('Your vote has been recorded successfully!', 'success');
        }, 3000);
    }, 1500);
}

function loadVotingCandidates() {
    const container = document.querySelector('.candidates-voting');
    container.innerHTML = '';
    
    electionData.candidates.forEach(candidate => {
        const candidateDiv = document.createElement('div');
        candidateDiv.className = 'voting-candidate';
        candidateDiv.dataset.candidateId = candidate.id;
        
        candidateDiv.innerHTML = `
            <div class="candidate-header">
                <div class="candidate-avatar" style="background: ${candidate.color}">
                    ${candidate.initials}
                </div>
                <div class="candidate-details">
                    <h4>${candidate.name}</h4>
                    <p>${candidate.party}</p>
                </div>
            </div>
            <div class="candidate-platform">
                ${candidate.platform}
            </div>
        `;
        
        candidateDiv.addEventListener('click', function() {
            document.querySelectorAll('.voting-candidate').forEach(c => {
                c.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            const selectedInfo = document.getElementById('selected-candidate-info');
            selectedInfo.innerHTML = `
                <div>
                    <strong>Selected:</strong> ${candidate.name} (${candidate.party})
                    <br>
                    <small>${candidate.tagline}</small>
                </div>
            `;
            
            document.getElementById('submit-vote').disabled = false;
        });
        
        container.appendChild(candidateDiv);
    });
}

function resetVotingForm() {
    document.getElementById('voter-id-section').style.display = 'block';
    document.getElementById('voting-section').style.display = 'none';
    document.getElementById('verification-success').style.display = 'none';
    document.getElementById('voting-success').style.display = 'none';
    
    document.getElementById('voter-id').value = '';
    document.getElementById('voter-pin').value = '';
    document.getElementById('submit-vote').disabled = true;
    
    document.querySelectorAll('.voting-candidate').forEach(c => {
        c.classList.remove('selected');
    });
    
    document.getElementById('selected-candidate-info').textContent = 'No candidate selected';
}

// Utility Functions
function isValidVoterId(voterId) {
    return voterId.length === 12 && /^[A-Z0-9]+$/.test(voterId);
}

function isValidPin(pin) {
    return pin.length === 6 && /^\d+$/.test(pin);
}

function updateStatistics() {
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    const onlineVotes = votes.length;
    
    // Update display
    document.getElementById('online-votes').textContent = onlineVotes.toLocaleString();
    document.getElementById('total-votes').textContent = electionData.totalVotes.toLocaleString();
    
    // Update progress circle
    const goalPercent = Math.min(100, Math.round((onlineVotes / 500) * 100));
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const dashOffset = 251.2 * (1 - goalPercent / 100);
        progressFill.style.strokeDashoffset = dashOffset;
        document.querySelector('.progress-text').textContent = `${goalPercent}%`;
    }
}

function loadRecentVotes() {
    const votesList = document.getElementById('votes-list');
    const votes = JSON.parse(localStorage.getItem('votes') || '[]');
    
    // Show last 5 votes
    const recentVotes = votes.slice(-5).reverse();
    
    votesList.innerHTML = '';
    
    recentVotes.forEach(vote => {
        const candidate = electionData.candidates.find(c => c.id === vote.candidateId);
        if (!candidate) return;
        
        const voteTime = new Date(vote.timestamp);
        const timeString = voteTime.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const voteItem = document.createElement('div');
        voteItem.className = 'vote-item';
        voteItem.innerHTML = `
            <div class="vote-candidate">
                <div class="candidate-badge" style="background: ${candidate.color}">
                    ${candidate.initials}
                </div>
                <span>${candidate.name}</span>
            </div>
            <div class="vote-time">${timeString}</div>
        `;
        
        votesList.appendChild(voteItem);
    });
}

function addRecentVote(candidateId, timeString) {
    const votesList = document.getElementById('votes-list');
    const candidate = electionData.candidates.find(c => c.id === candidateId);
    
    if (!candidate) return;
    
    const voteItem = document.createElement('div');
    voteItem.className = 'vote-item';
    voteItem.innerHTML = `
        <div class="vote-candidate">
            <div class="candidate-badge" style="background: ${candidate.color}">
                ${candidate.initials}
            </div>
            <span>${candidate.name}</span>
        </div>
        <div class="vote-time">${timeString}</div>
    `;
    
    votesList.insertBefore(voteItem, votesList.firstChild);
    
    // Keep only 5 items
    while (votesList.children.length > 5) {
        votesList.removeChild(votesList.lastChild);
    }
}

function updateVotingTimer() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    
    const diff = end - now;
    
    if (diff <= 0) {
        document.getElementById('voting-timer').textContent = '00:00:00';
        document.getElementById('vote-now-btn').disabled = true;
        return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('voting-timer').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    document.body.appendChild(notification);
}

// Existing Functions (keep these)
function updateCandidates() {
    const candidatesList = document.getElementById('candidates-list');
    candidatesList.innerHTML = '';
    
    electionData.candidates.forEach(candidate => {
        const candidateItem = document.createElement('div');
        candidateItem.className = 'candidate-item';
        
        const votePercentage = (candidate.votes / electionData.totalVotes * 100).toFixed(1);
        
        candidateItem.innerHTML = `
            <div class="candidate-info">
                <div class="candidate-photo" style="background: ${candidate.color}">
                    ${candidate.initials}
                </div>
                <div class="candidate-details">
                    <div class="candidate-name">${candidate.name}</div>
                    <div class="candidate-party">${candidate.party}</div>
                </div>
            </div>
            <div class="candidate-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${candidate.party.toLowerCase()}" 
                         style="width: ${votePercentage}%"></div>
                </div>
                <div class="vote-count">
                    <span>${votePercentage}%</span>
                    <span>${candidate.votes.toLocaleString()} votes</span>
                </div>
            </div>
        `;
        
        candidatesList.appendChild(candidateItem);
    });
}

function updateRecentUpdates() {
    const updatesList = document.getElementById('updates-list');
    updatesList.innerHTML = '';
    
    electionData.updates.forEach(update => {
        const updateItem = document.createElement('div');
        updateItem.className = 'update-item';
        updateItem.innerHTML = `
            <div class="update-time">${update.time}</div>
            <div class="update-text">${update.text}</div>
        `;
        updatesList.appendChild(updateItem);
    });
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    document.getElementById('update-time').textContent = timeString;
}

function refreshData() {
    // Simulate data update
    electionData.totalVotes = Math.floor(Math.random() * 2000000) + 8000000;
    electionData.turnout = (Math.random() * 10 + 62).toFixed(1);
    electionData.precinctsReporting = Math.floor(Math.random() * 5 + 90);
    electionData.remainingPrecincts = Math.floor(Math.random() * 100) + 250;
    
    // Update candidate votes
    electionData.candidates.forEach(candidate => {
        const change = Math.floor(Math.random() * 50000) - 25000;
        candidate.votes = Math.max(1000000, candidate.votes + change);
    });
    
    // Update UI
    updateCandidates();
    updateStatistics();
    updateTime();
    
    // Add loading animation
    const icon = document.querySelector('#refresh-btn i');
    icon.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        icon.style.transform = 'rotate(0deg)';
    }, 300);
}

function simulateLiveUpdate() {
    const randomCandidate = electionData.candidates[
        Math.floor(Math.random() * electionData.candidates.length)
    ];
    
    const change = Math.floor(Math.random() * 10000) + 5000;
    randomCandidate.votes += change;
    electionData.totalVotes += change;
    
    updateCandidates();
    updateStatistics();
}