<template>
  <div class="login-instructions">
    <h3>🔐 Mock Login Credentials</h3>
    
    <div class="credential-card admin">
      <h4>Admin Account</h4>
      <p><strong>Email:</strong> admin@comphility.com</p>
      <p><strong>Password:</strong> admin123</p>
      <p class="note">✅ Access to Admin Panel</p>
    </div>
    
    <div class="credential-card user">
      <h4>User Account</h4>
      <p><strong>Email:</strong> user@comphility.com</p>
      <p><strong>Password:</strong> user123</p>
      <p class="note">✅ Regular user access</p>
    </div>
    
    <div class="credential-card user">
      <h4>Test User</h4>
      <p><strong>Email:</strong> ryan@gmail.com</p>
      <p><strong>Password:</strong> ryan123</p>
      <p class="note">✅ Another test account</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginInstructions'
}
</script>

<style scoped>
.login-instructions {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  z-index: 999;
}

.login-instructions h3 {
  margin-top: 0;
  color: #333;
  font-size: 1.1rem;
  margin-bottom: 15px;
  text-align: center;
}

.credential-card {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #5b7eff;
}

.credential-card.admin {
  border-left-color: #4caf50;
}

.credential-card h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.credential-card p {
  margin: 5px 0;
  color: #666;
  font-size: 0.9rem;
}

.credential-card p strong {
  color: #333;
  display: inline-block;
  width: 80px;
}

.note {
  margin-top: 10px !important;
  color: #4caf50 !important;
  font-weight: 600;
  font-size: 0.85rem !important;
}

@media (max-width: 768px) {
  .login-instructions {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
