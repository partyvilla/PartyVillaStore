'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface UseTabVisibilityOptions {
  onVisibilityChange?: (isVisible: boolean) => void
  onTabActive?: () => void
  onTabInactive?: () => void
  debounceMs?: number
}

// Global state to prevent multiple simultaneous reactivations
let isReactivating = false
let reactivationTimeout: NodeJS.Timeout | null = null

export function useTabVisibility(options: UseTabVisibilityOptions = {}) {
  const [isVisible, setIsVisible] = useState(true)
  const [wasInactive, setWasInactive] = useState(false)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  
  const {
    onVisibilityChange,
    onTabActive,
    onTabInactive,
    debounceMs = 300 // Increased debounce to prevent rapid triggers
  } = options

  const handleVisibilityChange = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      const isCurrentlyVisible = document.visibilityState === 'visible'
      
      setIsVisible(isCurrentlyVisible)
      
      if (isCurrentlyVisible && wasInactive) {
        // Tab became active after being inactive
        onTabActive?.()
        setWasInactive(false)
      } else if (!isCurrentlyVisible) {
        // Tab became inactive
        onTabInactive?.()
        setWasInactive(true)
      }
      
      onVisibilityChange?.(isCurrentlyVisible)
    }, debounceMs)
  }, [onVisibilityChange, onTabActive, onTabInactive, wasInactive, debounceMs])

  useEffect(() => {
    // Set initial state
    setIsVisible(document.visibilityState === 'visible')
    
    // Add event listener
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also listen for focus/blur events as backup
    const handleFocus = () => {
      if (wasInactive) {
        onTabActive?.()
        setWasInactive(false)
      }
    }
    
    const handleBlur = () => {
      onTabInactive?.()
      setWasInactive(true)
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [handleVisibilityChange, onTabActive, onTabInactive, wasInactive])

  return {
    isVisible,
    wasInactive
  }
}

// Coordinated reactivation hook that prevents multiple simultaneous calls
export function useTabReactivation(onReactivate: () => void, dependencies: any[] = [], priority: 'high' | 'medium' | 'low' = 'medium') {
  const hasReactivated = useRef(false)
  const onReactivateRef = useRef(onReactivate)
  
  // Update ref when function changes
  useEffect(() => {
    onReactivateRef.current = onReactivate
  }, [onReactivate])
  
  useTabVisibility({
    onTabActive: useCallback(() => {
      if (isReactivating) {
        return
      }
      
      isReactivating = true
      hasReactivated.current = true
      
      // Clear any existing timeout
      if (reactivationTimeout) {
        clearTimeout(reactivationTimeout)
      }
      
      // Stagger reactivation based on priority
      const delay = priority === 'high' ? 0 : priority === 'medium' ? 100 : 200
      
      reactivationTimeout = setTimeout(() => {
        onReactivateRef.current()
        
        // Reset the flag after a short delay to allow other components
        setTimeout(() => {
          isReactivating = false
        }, 500)
      }, delay)
    }, [priority])
  })

  // Also run on dependency changes if tab was reactivated
  useEffect(() => {
    if (hasReactivated.current && !isReactivating) {
      onReactivateRef.current()
      hasReactivated.current = false
    }
  }, dependencies)
}

// Hook to listen for global reactivation events (removed to reduce conflicts)
export function useGlobalReactivation(onReactivate: () => void) {
  const onReactivateRef = useRef(onReactivate)
  
  useEffect(() => {
    onReactivateRef.current = onReactivate
  }, [onReactivate])

  useEffect(() => {
    const handleReactivation = () => {
      if (isReactivating) return // Prevent conflicts
      
      onReactivateRef.current()
    }

    const handleConnectionRestored = () => {
      if (isReactivating) return // Prevent conflicts
      
      onReactivateRef.current()
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('tab-reactivated', handleReactivation)
      window.addEventListener('connection-restored', handleConnectionRestored)
      
      return () => {
        window.removeEventListener('tab-reactivated', handleReactivation)
        window.removeEventListener('connection-restored', handleConnectionRestored)
      }
    }
  }, [])
}