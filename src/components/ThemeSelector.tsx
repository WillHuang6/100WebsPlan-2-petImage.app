'use client'

import React from 'react'
import { Theme } from '@/config/templates'
import { Button } from '@/components/ui/button'

interface ThemeSelectorProps {
  themes: Theme[]
  selectedTheme: string | null
  onThemeSelect: (themeId: string) => void
  isLoading?: boolean
}

export default function ThemeSelector({
  themes,
  selectedTheme,
  onThemeSelect,
  isLoading = false
}: ThemeSelectorProps) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 animate-pulse bg-gray-200 rounded-lg px-4 py-2 h-10 w-24"
            />
          ))}
        </div>
      </div>
    )
  }

  if (!themes || themes.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* All Themes button */}
        <Button
          variant={selectedTheme === null ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeSelect('')}
          className={`flex-shrink-0 transition-all duration-200 ${
            selectedTheme === null
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'hover:bg-gray-100 border-gray-200'
          }`}
        >
          <span className="mr-1">🎨</span>
          All
        </Button>

        {/* Theme buttons */}
        {themes.map((theme) => (
          <Button
            key={theme.id}
            variant={selectedTheme === theme.id ? "default" : "outline"}
            size="sm"
            onClick={() => onThemeSelect(theme.id)}
            className={`flex-shrink-0 transition-all duration-200 ${
              selectedTheme === theme.id
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'hover:bg-gray-100 border-gray-200'
            }`}
          >
            {theme.icon && <span className="mr-1">{theme.icon}</span>}
            <span>{theme.name}</span>
            {theme.count && (
              <span className="ml-1 text-xs opacity-75">({theme.count})</span>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}