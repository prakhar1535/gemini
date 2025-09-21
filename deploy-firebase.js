const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔥 Setting up Firebase Storage and Firestore...');

// Check if Firebase CLI is available
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.error('❌ Firebase CLI not found. Please install it first:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Set the project
try {
  execSync('firebase use gemini-c403d', { stdio: 'pipe' });
  console.log('✅ Firebase project set to gemini-c403d');
} catch (error) {
  console.log('⚠️  Could not set project automatically. You may need to run:');
  console.log('firebase use gemini-c403d');
}

// Deploy Firestore rules
try {
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Firestore rules deployed');
} catch (error) {
  console.error('❌ Failed to deploy Firestore rules:', error.message);
}

// Deploy Storage rules
try {
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  console.log('✅ Storage rules deployed');
} catch (error) {
  console.error('❌ Failed to deploy Storage rules:', error.message);
}

console.log('\n🎉 Firebase setup complete!');
console.log('\nNext steps:');
console.log('1. Test your gallery creation at: http://localhost:3000/create-gallery');
console.log('2. Check Firebase Console to see your data:');
console.log('   - Firestore: https://console.firebase.google.com/project/gemini-c403d/firestore');
console.log('   - Storage: https://console.firebase.google.com/project/gemini-c403d/storage');
