'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

interface DropdownMenuProps {
  children: React.ReactNode
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({
  asChild,
  children,
}) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext)
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, setIsOpen])

  if (asChild && React.isValidElement(children)) {
    return (
      <div ref={ref}>
        {React.cloneElement(children, { onClick: handleClick } as any)}
      </div>
    )
  }

  return (
    <div ref={ref}>
      <button onClick={handleClick} className="inline-flex items-center">
        {children}
      </button>
    </div>
  )
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: 'start' | 'end'
  className?: string
}

export const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({
  children,
  align = 'start',
  className = '',
}) => {
  const { isOpen, setIsOpen } = useContext(DropdownContext)

  if (!isOpen) return null

  const alignmentClass = align === 'end' ? 'right-0' : 'left-0'

  return (
    <div
      className={`absolute ${alignmentClass} mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}
      role="menu"
    >
      <div className="py-1" role="none">
        {children}
      </div>
    </div>
  )
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  asChild?: boolean
  className?: string
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  asChild,
  className = '',
}) => {
  const { setIsOpen } = useContext(DropdownContext)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setIsOpen(false)
  }

  const baseClasses = "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className: `${baseClasses} ${className}`,
      role: 'menuitem',
    } as any)
  }

  return (
    <button
      className={`${baseClasses} ${className}`}
      role="menuitem"
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export const DropdownMenuSeparator: React.FC = () => {
  return <div className="border-t border-gray-100 my-1" role="separator" />
}