import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const typeConfig = {
  danger: {
    icon: AlertCircle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    buttonVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonVariant: "default" as const,
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent immediate closing
    setIsConfirming(true);
    try {
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isConfirming && onCancel()}>
      <AlertDialogContent className={cn("max-w-md", config.bgColor, "border-2", config.borderColor)}>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white", config.iconColor)}>
              <Icon className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2 text-base leading-relaxed">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel onClick={onCancel} disabled={isConfirming}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isConfirming}
            className={cn(
              type === "danger" && "bg-red-600 hover:bg-red-700",
              type === "warning" && "bg-amber-600 hover:bg-amber-700",
              type === "info" && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isConfirming ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isConfirming ? "Processing..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
