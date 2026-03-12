const fs = require('fs');
const path = require('path');

console.log('🎥 LiveKit Configuration Helper\n');

// Read current .env file
const envPath = path.join(__dirname, '.env');
let envContent = fs.readFileSync(envPath, 'utf8');

console.log('📝 Instructions:');
console.log('1. Go to your LiveKit dashboard: https://cloud.livekit.io');
console.log('2. Click on "Project API keys"');
console.log('3. Copy your credentials\n');

console.log('Current LiveKit configuration in .env:');
console.log('----------------------------------------');

const apiKeyMatch = envContent.match(/LIVEKIT_API_KEY=(.+)/);
const apiSecretMatch = envContent.match(/LIVEKIT_API_SECRET=(.+)/);
const urlMatch = envContent.match(/LIVEKIT_URL=(.+)/);

const currentApiKey = apiKeyMatch ? apiKeyMatch[1] : 'not set';
const currentApiSecret = apiSecretMatch ? apiSecretMatch[1] : 'not set';
const currentUrl = urlMatch ? urlMatch[1] : 'not set';

console.log(`API Key:    ${currentApiKey}`);
console.log(`API Secret: ${currentApiSecret.substring(0, 20)}...`);
console.log(`URL:        ${currentUrl}`);
console.log('----------------------------------------\n');

if (currentApiKey === 'your-api-key' || currentApiKey === 'not set') {
    console.log('⚠️  LiveKit is NOT configured yet!\n');
    console.log('To configure LiveKit:');
    console.log('1. Open backend/.env file');
    console.log('2. Replace the following values:\n');
    console.log('   LIVEKIT_API_KEY=your-api-key-from-dashboard');
    console.log('   LIVEKIT_API_SECRET=your-api-secret-from-dashboard');
    console.log('   LIVEKIT_URL=wss://your-project.livekit.cloud\n');
    console.log('3. Save the file');
    console.log('4. Restart the backend server\n');
} else {
    console.log('✅ LiveKit appears to be configured!');
    console.log('   Make sure to restart the backend if you just updated the credentials.\n');
}

console.log('📚 For detailed setup instructions, see: LIVEKIT_SETUP_GUIDE.md');
