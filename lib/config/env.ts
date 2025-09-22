type EnvVarConfig = {
  name: string;
  required: boolean;
  defaultValue?: string;
}

/**
 * Gets an environment variable with proper error handling
 */
export function getEnvVar(config: EnvVarConfig): string {
  const { name, required, defaultValue } = config;
  const value = process.env[name];

  if (!value) {
    if (required && !defaultValue) {
      const errorMessage = `Required environment variable ${name} is missing`;
      throw new Error(errorMessage);
    }
    return defaultValue || '';
  }

  return value;
}

/**
 * Supabase configuration values
 */
export const supabaseConfig = {
  url: getEnvVar({ 
    name: 'NEXT_PUBLIC_SUPABASE_URL', 
    required: true
  }),
  anonKey: getEnvVar({ 
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
    required: true
  }),
  serviceKey: getEnvVar({ 
    name: 'SUPABASE_SERVICE_ROLE_KEY', 
    required: true
  })
}

/**
 * Cloudinary configuration values
 */
export const cloudinaryConfig = {
  cloudName: getEnvVar({ 
    name: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 
    required: true
  }),
  apiKey: getEnvVar({ 
    name: 'CLOUDINARY_API_KEY', 
    required: true
  }),
  apiSecret: getEnvVar({ 
    name: 'CLOUDINARY_API_SECRET', 
    required: true
  })
}

/**
 * Telegram bot configuration values
 */
export const telegramConfig = {
  botToken: getEnvVar({ 
    name: 'TELEGRAM_BOT_TOKEN', 
    required: false
  }),
  chatId: getEnvVar({ 
    name: 'TELEGRAM_CHAT_ID', 
    required: false
  })
}

/**
 * Email service configuration values
 */
export const emailConfig = {
  host: getEnvVar({ 
    name: 'EMAIL_HOST', 
    required: false,
    defaultValue: 'smtp.gmail.com'
  }),
  port: parseInt(getEnvVar({ 
    name: 'EMAIL_PORT', 
    required: false,
    defaultValue: '587'
  })),
  user: getEnvVar({ 
    name: 'EMAIL_USER', 
    required: false
  }),
  password: getEnvVar({ 
    name: 'EMAIL_PASS', 
    required: false
  }),
  fromEmail: getEnvVar({ 
    name: 'FROM_EMAIL', 
    required: false,
    defaultValue: 'Party Villa <noreply@partyvilla.com>'
  })
}

/**
 * Check if all required environment variables are available
 * Use this for early validation during app initialization
 */
export function validateEnvVars(): boolean {
  try {
    // Check all required variables
    if (!supabaseConfig.url) {
      return false;
    }
    
    if (!supabaseConfig.anonKey) {
      return false;
    }
    
    if (!supabaseConfig.serviceKey) {
      return false;
    }

    // Check Cloudinary variables
    if (!cloudinaryConfig.cloudName) {
      return false;
    }
    
    if (!cloudinaryConfig.apiKey) {
      return false;
    }
    
    if (!cloudinaryConfig.apiSecret) {
      return false;
    }

    // Check Telegram variables (optional for app functionality)
    if (!telegramConfig.botToken) {
    }
    
    if (!telegramConfig.chatId) {
    }
    
    // Check Email variables (optional for app functionality)
    if (!emailConfig.user || !emailConfig.password) {
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
