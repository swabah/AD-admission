/**
 * PhotoUploadSection Component
 * Handles photo upload with compression using shadcn
 */

import { useRef, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { handlePhotoUpload } from "../utils/imageCompression";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PhotoUploadSectionProps {
  photoDataURL: string | null;
  onPhotoUpload: (dataURL: string) => void;
}

export function PhotoUploadSection({
  photoDataURL,
  onPhotoUpload,
}: PhotoUploadSectionProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handlePhotoUpload(
      file,
      (dataURL) => onPhotoUpload(dataURL),
      (message) => alert(message),
    );
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider">
        Student Photo
      </Label>
      <Card
        className={cn(
          "cursor-pointer overflow-hidden transition-all hover:border-navy-light hover:bg-blue-50",
          !photoDataURL && "border-dashed border-2"
        )}
        onClick={() => photoInputRef.current?.click()}
      >
        <CardContent className="p-0">
          {photoDataURL ? (
            <img
              src={photoDataURL}
              alt="Photo preview"
              className="h-[172px] w-[140px] object-cover"
            />
          ) : (
            <div className="flex h-[172px] w-[140px] flex-col items-center justify-center gap-2 text-muted-foreground">
              <Camera className="h-8 w-8" />
              <span className="text-xs font-medium">Upload Photo</span>
              <span className="text-[10px] opacity-70">JPG, PNG up to 5MB</span>
            </div>
          )}
        </CardContent>
      </Card>
      <input
        type="file"
        id="photoInput"
        accept="image/*"
        onChange={handleFileSelect}
        ref={photoInputRef}
        className="hidden"
      />
    </div>
  );
}

export default PhotoUploadSection;
