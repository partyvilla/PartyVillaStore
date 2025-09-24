// Validate Supabase environment configuration (works in both client and server)
export const validateSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const nodeEnv = process.env.NODE_ENV
  
  const issues: string[] = []
  
  if (!url) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL is not defined')
  } else if (!url.startsWith('https://')) {
    issues.push('NEXT_PUBLIC_SUPABASE_URL should start with https://')
  }
  
  if (!key) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined')
  } else if (key.length < 100) {
    issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short (should be ~100+ characters)')
  }
  
  if (nodeEnv === 'production') {
    // Production-specific validations
    if (url?.includes('localhost') || url?.includes('127.0.0.1')) {
      issues.push('Production build is using localhost Supabase URL')
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
    config: {
      url,
      keyLength: key?.length || 0,
      environment: nodeEnv
    }
  }
}

// Log configuration status (for debugging)
export const logSupabaseConfig = () => {
  const validation = validateSupabaseConfig()
  return validation
}