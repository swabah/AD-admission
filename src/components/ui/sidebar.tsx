"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  children: React.ReactNode
  className?: string
}

const Sidebar = ({ className, children }: SidebarProps) => {
  return (
    <div className={cn("flex h-full w-full flex-col bg-navy text-white", className)}>
      {children}
    </div>
  )
}

interface SidebarHeaderProps {
  children: React.ReactNode
  className?: string
}

const SidebarHeader = ({ className, children }: SidebarHeaderProps) => {
  return (
    <div className={cn("flex flex-col border-b border-white/10 p-6", className)}>
      {children}
    </div>
  )
}

interface SidebarContentProps {
  children: React.ReactNode
  className?: string
}

const SidebarContent = ({ className, children }: SidebarContentProps) => {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)}>
      {children}
    </div>
  )
}

interface SidebarFooterProps {
  children: React.ReactNode
  className?: string
}

const SidebarFooter = ({ className, children }: SidebarFooterProps) => {
  return (
    <div className={cn("border-t border-white/10 p-4", className)}>
      {children}
    </div>
  )
}

interface SidebarGroupProps {
  children: React.ReactNode
  className?: string
}

const SidebarGroup = ({ className, children }: SidebarGroupProps) => {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  )
}

interface SidebarGroupLabelProps {
  children: React.ReactNode
  className?: string
}

const SidebarGroupLabel = ({ className, children }: SidebarGroupLabelProps) => {
  return (
    <h3 className={cn("px-3 text-xs font-semibold uppercase tracking-wider text-white/50", className)}>
      {children}
    </h3>
  )
}

interface SidebarMenuProps {
  children: React.ReactNode
  className?: string
}

const SidebarMenu = ({ className, children }: SidebarMenuProps) => {
  return (
    <nav className={cn("space-y-1", className)}>
      {children}
    </nav>
  )
}

interface SidebarMenuItemProps {
  children: React.ReactNode
  className?: string
}

const SidebarMenuItem = ({ className, children }: SidebarMenuItemProps) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  )
}

interface SidebarMenuButtonProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  isActive?: boolean
  onClick?: () => void
}

const SidebarMenuButton = ({ 
  className, 
  children, 
  asChild = false,
  isActive = false,
  onClick
}: SidebarMenuButtonProps) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-white/10 text-white" 
          : "text-white/70 hover:bg-white/5 hover:text-white",
        className
      )}
    >
      {children}
    </Comp>
  )
}

interface SidebarTriggerProps {
  className?: string
}

const SidebarTrigger = ({ className }: SidebarTriggerProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("lg:hidden", className)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-navy p-0">
        {/* Mobile sidebar content will be rendered via children */}
      </SheetContent>
    </Sheet>
  )
}

interface SidebarInsetProps {
  children: React.ReactNode
  className?: string
}

const SidebarInset = ({ className, children }: SidebarInsetProps) => {
  return (
    <main className={cn("flex flex-1 flex-col overflow-hidden", className)}>
      {children}
    </main>
  )
}

interface SidebarProviderProps {
  children: React.ReactNode
  className?: string
}

const SidebarProvider = ({ className, children }: SidebarProviderProps) => {
  return (
    <div className={cn("flex min-h-screen", className)}>
      {children}
    </div>
  )
}

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
}
