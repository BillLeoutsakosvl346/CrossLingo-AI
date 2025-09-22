// CrossLingo Color Scheme
const primaryGreen = '#00B140'; // Vibrant Green - Growth/learning; main UI elements
const trustBlue = '#007BFF'; // Trust Blue - Stability; chats/text
const passionRed = '#DC3545'; // Passion Red - Excitement/sexiness; notifications, flirty highlights, XP gains
const midGray = '#6C757D'; // Mid Gray - Backgrounds
const white = '#FFFFFF'; // White
const black = '#000000'; // Black for dark mode

export default {
  light: {
    text: black,
    background: white,
    primary: primaryGreen,
    secondary: trustBlue,
    accent: passionRed,
    neutral: midGray,
    
    // Navigation colors
    tint: primaryGreen,
    tabIconDefault: midGray,
    tabIconSelected: primaryGreen,
    
    // UI element colors
    buttonPrimary: primaryGreen,
    buttonSecondary: trustBlue,
    notification: passionRed,
    progress: primaryGreen,
    border: midGray + '40',
    surface: white,
    surfaceVariant: midGray + '20',
  },
  dark: {
    text: white,
    background: '#1A1A1A',
    primary: primaryGreen,
    secondary: trustBlue,
    accent: passionRed,
    neutral: midGray,
    
    // Navigation colors
    tint: primaryGreen,
    tabIconDefault: midGray,
    tabIconSelected: primaryGreen,
    
    // UI element colors
    buttonPrimary: primaryGreen,
    buttonSecondary: trustBlue,
    notification: passionRed,
    progress: primaryGreen,
    border: midGray + '60',
    surface: '#2A2A2A',
    surfaceVariant: midGray + '40',
  },
};
