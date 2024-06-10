// Define type
const NotificationType = Object.freeze({
  Email: 'email',
  Socket: 'socket',
  Push: 'push',
  All: 'all'
})

// Define category type
const NotificationCategoryType = Object.freeze({
  Register: 'register',
  Login: 'login',
  VerifyEmail: 'verifyEmail',
  ResendVerificationCode: 'resendVerificationCode',
  GenerateResetPasswordCode: 'generateResetCode',
  ResendResetCode: 'resendResetCode',
  ResetCode: 'resetPassword',
})

// Define channel type
const NotificationChannelType = Object.freeze({
  Default: 'notification-all',
  Email: 'notification-email',
  Socket: 'notification-socket',
  Push: 'notification-push',
})

module.exports = {
  NotificationType,
  NotificationCategoryType,
  NotificationChannelType
}