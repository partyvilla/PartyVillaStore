"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, AlertCircle, Image } from 'lucide-react'

interface CategoryImageUploadProps {
  value?: File
  onChange: (value: File | null) => void
  disabled?: boolean
}

export function CategoryImageUpload({ value, onChange, disabled }: CategoryImageUploadProps) {
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Create preview URL for File objects
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [value])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    
    try {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB')
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file')
      }

      // Store the file object instead of uploading immediately
      onChange(file)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid file'
      setError(message)
    }
  }

  const removeImage = () => {
    onChange(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="w-full sm:w-auto"
        >
          <Upload className="h-4 w-4 mr-2" />
          Select Image
        </Button>
        
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="text-xs text-muted-foreground">
          Recommended: 400x400px, max 5MB
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Category preview"
            className="h-32 w-32 object-cover rounded-md border"
            onError={() => setError('Failed to load image preview')}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
            onClick={removeImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {value instanceof File && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
          <Image className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-700">
            Selected: {value.name} ({(value.size / 1024 / 1024).toFixed(2)} MB)
          </span>
        </div>
      )}
    </div>
  )
}
