'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  onImageSelect: (file: File) => void
  selectedImage: File | null
  isDisabled?: boolean
  className?: string
  onImageClear?: () => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png']
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  selectedImage,
  isDisabled = false,
  className,
  onImageClear
}) => {
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
        setError('File size must be less than 5MB')
      } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
        setError('Only JPG and PNG files are supported')
      } else {
        setError('Invalid file. Please try again.')
      }
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      onImageSelect(file)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [onImageSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    disabled: isDisabled
  })

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setError(null)
    // 这里可以调用一个清除选中图片的回调
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <section className={cn("", className)}>
      
      <div>
        {!selectedImage ? (
          <Card
            {...getRootProps()}
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-lg',
              isDragActive && 'border-blue-500 bg-blue-50',
              isDisabled && 'cursor-not-allowed opacity-50',
              error && 'border-red-300 bg-red-50'
            )}
          >
            <CardContent className="p-8">
              <input {...getInputProps()} />
              
              <div className="text-center">
                <div className="mb-4">
                  <svg 
                    className={cn(
                      'w-12 h-12 mx-auto',
                      isDragActive ? 'text-yellow-500' : 'text-gray-400'
                    )} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                </div>
                
                {isDragActive ? (
                  <p className="text-lg font-medium text-yellow-600 mb-2">
                    Drop your photo here
                  </p>
                ) : (
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Click or drag an image here
                  </p>
                )}
                
                <p className="text-sm text-gray-500">
                  JPG, PNG, GIF (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              {/* Image Preview - Centered and Full Display */}
              <div className="mb-4">
                {previewUrl && (
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Pet photo preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
              
              {/* Cancel Button */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl)
                      setPreviewUrl(null)
                    }
                    setError(null)
                    if (onImageClear) {
                      onImageClear()
                    }
                  }}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ImageUploader