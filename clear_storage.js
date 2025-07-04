// SAFETY WARNING: This will only clear your login session, not your wedding data
// Your weddings, guests, and photos are safely stored in the database

const confirmClear = confirm(
  "⚠️ WARNING: This will log you out of your account.\n\n" +
  "✅ Your wedding data is SAFE in the database\n" +
  "❌ You will need to log back in to access it\n\n" +
  "Continue with clearing login session?"
);

if (confirmClear) {
  const backupData = {
    authToken: localStorage.getItem('authToken'),
    currentUser: localStorage.getItem('currentUser'),
    adminToken: localStorage.getItem('adminToken'),
    timestamp: new Date().toISOString()
  };
  
  console.log("Session backup (save this if needed):", backupData);
  
  localStorage.clear();
  alert("✅ Storage cleared. You can now log back in to access your wedding data.");
  location.reload();
} else {
  alert("❌ Operation cancelled. Your session remains active.");
}
