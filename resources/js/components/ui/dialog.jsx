"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

// =============== OVERLAY (tanpa blur) =================
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 pointer-events-none z-40",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// =============== CONTENT (FULL RESPONSIVE) =================
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />

    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        `
        fixed left-1/2 top-1/2 z-50 
        w-[90%] max-w-lg     /* mobile: 90% width, desktop: max 32rem */
        -translate-x-1/2 -translate-y-1/2

        rounded-xl border bg-white 
        p-5 shadow-lg

        /* ANIMATION */
        data-[state=open]:animate-in 
        data-[state=open]:fade-in-0 
        data-[state=open]:zoom-in-95
        data-[state=closed]:animate-out 
        data-[state=closed]:fade-out-0 
        data-[state=closed]:zoom-out-95
        `,
        className
      )}
    >
      {children}

      {/* CLOSE BUTTON */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 opacity-60 hover:opacity-100">
        <X className="h-5 w-5" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// =============== HEADER / FOOTER =================
const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)

// =============== TITLE / DESCRIPTION =================
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose
}
