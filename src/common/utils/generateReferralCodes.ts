export default function generateReferralCode(length = 6) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let referralCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    referralCode += charset.charAt(randomIndex);
  }
  referralCode = referralCode.toUpperCase();
  return referralCode;
}
