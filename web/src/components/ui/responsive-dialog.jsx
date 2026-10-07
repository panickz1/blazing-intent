"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"

const MOBILE_QUERY = "(max-width: 639px)"

const subscribe = (onChange) => {
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

export const useIsMobile = () =>
  React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false
  )

const MobileContext = React.createContext(false)

const ResponsiveDialog = ({ children, ...props }) => {
  const isMobile = useIsMobile()
  const Root = isMobile ? Drawer : Dialog
  return (
    <MobileContext.Provider value={isMobile}>
      <Root {...props}>{children}</Root>
    </MobileContext.Provider>
  )
}

const ResponsiveDialogContent = React.forwardRef(
  ({ className, dialogClassName, drawerClassName, children, ...props }, ref) => {
    const isMobile = React.useContext(MobileContext)
    if (!isMobile) {
      return (
        <DialogContent ref={ref} className={cn(className, dialogClassName)} {...props}>
          {children}
        </DialogContent>
      )
    }
    return (
      <DrawerContent ref={ref} className={cn("max-h-[92dvh]", className, drawerClassName)} {...props}>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(24px,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </DrawerContent>
    )
  }
)
ResponsiveDialogContent.displayName = "ResponsiveDialogContent"

const pick = (DialogPart, DrawerPart, name) => {
  const Part = React.forwardRef((props, ref) => {
    const C = React.useContext(MobileContext) ? DrawerPart : DialogPart
    return <C ref={ref} {...props} />
  })
  Part.displayName = name
  return Part
}

const ResponsiveDialogTitle = pick(DialogTitle, DrawerTitle, "ResponsiveDialogTitle")
const ResponsiveDialogDescription = pick(DialogDescription, DrawerDescription, "ResponsiveDialogDescription")
const ResponsiveDialogClose = pick(DialogClose, DrawerClose, "ResponsiveDialogClose")

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
  ResponsiveDialogClose,
}
