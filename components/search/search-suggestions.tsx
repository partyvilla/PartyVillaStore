"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SearchSuggestion {
  id: string
  name: string
  category: string
  image_url?: string | null
  description?: string
}

interface SearchSuggestionsProps {
  placeholder?: string
  className?: string
  onSubmit?: (query: string) => void
  isMobile?: boolean
}

export function SearchSuggestions({ 
  placeholder = "Search for balloons, decorations, gifts...", 
  className,
  onSubmit,
  isMobile = false
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchProducts(query.trim())
      } else {
        setSuggestions([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  const searchProducts = async (searchQuery: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=6`)
      const data = await response.json()
      
      if (data.suggestions) {
        setSuggestions(data.suggestions)
        setIsOpen(data.suggestions.length > 0)
      }
    } catch (error) {
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const searchQuery = query.trim()
      
      if (onSubmit) {
        onSubmit(searchQuery)
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      }
      
      // Clear search state after navigation
      setQuery("")
      setSuggestions([])
      setIsOpen(false)
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Clear the search state
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    setSelectedIndex(-1)
    
    // Navigate to product
    router.push(`/product/${suggestion.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex])
        } else {
          handleSubmit(e)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const clearSearch = () => {
    setQuery("")
    setSuggestions([])
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <Search className={cn(
            "absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/50 group-focus-within:text-primary transition-colors duration-200",
            isMobile && "left-3"
          )} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true)
            }}
            placeholder={placeholder}
            className={cn(
              "w-full min-w-0 rounded-full border-2 border-primary/10 bg-white pl-11 pr-10 py-2.5 text-sm outline-none",
              "focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all duration-200",
              isMobile && "pl-10 pr-8 py-2 border border-gray-300 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary/50"
            )}
            aria-label="Search products"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className={cn(
                "absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors",
                isMobile && "right-3"
              )}
              aria-label="Clear search"
            >
              <X className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
        >
          {isLoading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Searching...
            </div>
          )}
          
          {!isLoading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="p-4 text-center text-gray-500">
              <div className="mb-2">🔍</div>
              <div className="text-sm">No products found for "{query}"</div>
              <div className="text-xs text-gray-400 mt-1">Try searching for different keywords</div>
            </div>
          )}

          {!isLoading && suggestions.length > 0 && (
            <>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors",
                    selectedIndex === index && "bg-primary/5"
                  )}
                >
                  {suggestion.image_url && 
                   suggestion.image_url.trim() !== "" ? (
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={suggestion.image_url}
                        alt={suggestion.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide the image element and show fallback
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML = '<span class="text-gray-400 text-xs">📦</span>';
                            parent.className = "flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center";
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">📦</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {suggestion.category}
                    </div>
                    {suggestion.description && (
                      <div className="text-xs text-gray-400 truncate mt-1">
                        {suggestion.description}
                      </div>
                    )}
                  </div>
                  <Search className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </button>
              ))}
              {query.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    const searchQuery = query.trim()
                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                    // Clear search state
                    setQuery("")
                    setSuggestions([])
                    setIsOpen(false)
                    setSelectedIndex(-1)
                  }}
                  className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 text-primary border-t border-gray-200"
                >
                  <Search className="w-4 h-4" />
                  <span>Search for "{query}" in all products</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}