document.addEventListener('DOMContentLoaded', function() {
    // Load bots table
    loadBots();
    
    // Load system status
    loadSystemStatus();
    setInterval(loadSystemStatus, 5000);
    
    // Form submission
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const botName = document.getElementById('botName').value;
        const prefix = document.getElementById('prefix').value;
        const adminUID = document.getElementById('adminUID').value;
        const appstate = document.getElementById('appstate').value;
        
        // Validate JSON
        try {
            JSON.parse(appstate);
        } catch (e) {
            alert('Invalid Appstate JSON: ' + e.message);
            return;
        }
        
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                appstate,
                prefix,
                botName,
                adminUID
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Configuration saved successfully!');
                loadBots();
                // Clear form
                document.getElementById('registerForm').reset();
            } else {
                alert('Error: ' + (data.error || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving configuration');
        });
    });
});

function loadBots() {
    fetch('/api/users')
        .then(response => response.json())
        .then(users => {
            const tableBody = document.getElementById('botsTable');
            tableBody.innerHTML = '';
            
            if (users.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No bots registered yet</td></tr>';
                return;
            }
            
            users.forEach(user => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user.botName || 'N/A'}</td>
                    <td>${user.prefix || 'N/A'}</td>
                    <td>${user.adminUID || 'N/A'}</td>
                    <td><span class="status-${user.status}">${user.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="restartBot('${user.uid}')">Restart</button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading bots:', error);
            document.getElementById('botsTable').innerHTML = 
                '<tr><td colspan="5" class="text-center text-danger">Error loading bots</td></tr>';
        });
}

function loadSystemStatus() {
    fetch('/api/system-status')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const statusDiv = document.getElementById('systemStatus');
            
            // Format uptime
            const uptime = data.uptime || 0;
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            // Format memory
            const memory = data.memoryUsage || {};
            const usedMB = (memory.heapUsed / 1024 / 1024).toFixed(2);
            const totalMB = (memory.heapTotal / 1024 / 1024).toFixed(2);
            
            statusDiv.innerHTML = `
                <div class="system-stat">
                    <label>Uptime:</label>
                    <span>${days}d ${hours}h ${minutes}m ${seconds}s</span>
                </div>
                <div class="system-stat">
                    <label>Memory Usage:</label>
                    <span>${usedMB} MB / ${totalMB} MB</span>
                </div>
                <div class="system-stat">
                    <label>CPU Load (1/5/15 min):</label>
                    <span>${(data.loadavg[0]?.toFixed(2) || 0)} / ${(data.loadavg[1]?.toFixed(2) || 0)} / ${(data.loadavg[2]?.toFixed(2) || 0)}</span>
                </div>
                <div class="system-stat">
                    <label>Active Bots:</label>
                    <span>${data.activeBots || 0}</span>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error loading system status:', error);
            document.getElementById('systemStatus').innerHTML = 
                '<p class="text-danger">Error loading system status</p>';
        });
}

function restartBot(uid) {
    fetch(`/api/restart-bot/${uid}`, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Bot restart initiated');
                setTimeout(loadBots, 2000); // Refresh after a delay
            } else {
                alert('Error: ' + (data.error || 'Failed to restart bot'));
            }
        })
        .catch(error => {
            console.error('Error restarting bot:', error);
            alert('Error restarting bot');
        });
}
