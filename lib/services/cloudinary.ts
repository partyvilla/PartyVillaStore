import { v2 as cloudinary } from "cloudinary"
import { cloudinaryConfig } from "@/lib/config/env"

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
})

export { cloudinary }

// Utility function to upload image to Cloudinary
export async function uploadImageToCloudinary(
  file: File | Buffer,
  folder: string = 'party-villa-products'
): Promise<{ url: string; public_id: string }> {
  try {
    // Convert File to base64 if it's a File object
    let base64String: string
    
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      base64String = `data:${file.type};base64,${buffer.toString('base64')}`
    } else {
      base64String = `data:image/jpeg;base64,${file.toString('base64')}`
    }

    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return {
      url: result.secure_url,
      public_id: result.public_id,
    }
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary')
  }
}

// Utility function to delete image from Cloudinary
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    throw new Error('Failed to delete image from Cloudinary')
  }
}

// Utility function to extract public_id from Cloudinary URL
export function extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{folder}/{public_id}.{format}
    const url = new URL(cloudinaryUrl)
    const pathSegments = url.pathname.split('/')
    
    // Find the index after 'upload' in the path
    const uploadIndex = pathSegments.indexOf('upload')
    if (uploadIndex === -1) return null
    
    // Get everything after 'upload' and before the file extension
    const relevantSegments = pathSegments.slice(uploadIndex + 1)
    
    // Skip transformation parameters (they start with specific prefixes)
    const publicIdSegments = relevantSegments.filter(segment => {
      return !segment.startsWith('c_') && 
             !segment.startsWith('w_') && 
             !segment.startsWith('h_') && 
             !segment.startsWith('q_') && 
             !segment.startsWith('f_') &&
             segment !== '' &&
             !segment.startsWith('v')
    })
    
    // Join segments and remove file extension
    const fullPath = publicIdSegments.join('/')
    const publicId = fullPath.replace(/\.[^/.]+$/, '') // Remove file extension
    
    return publicId || null
  } catch (error) {
    return null
  }
}

// Utility function to get optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: string | number
    format?: string
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto' } = options
  
  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    fetch_format: 'auto',
  })
}
