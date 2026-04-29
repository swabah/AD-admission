/**
 * PhotoUploadSection Component
 * Handles photo upload with compression using shadcn
 */

import { useRef, type ChangeEvent } from "react";
import { Camera, Image as ImageIcon, Upload, MoreVertical } from "lucide-react";
import { handlePhotoUpload } from "../utils/imageCompression";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PhotoUploadSectionProps {
  photoDataURL: string | null;
  onPhotoUpload: (dataURL: string) => void;
}

export function PhotoUploadSection({
  photoDataURL,
  onPhotoUpload,
}: PhotoUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Student Photo
        </Label>
        {photoDataURL && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="gap-2 cursor-pointer">
                <Camera className="h-4 w-4" /> Camera
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2 cursor-pointer">
                <ImageIcon className="h-4 w-4" /> Change Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="relative group">
        <Card
          className={cn(
            "overflow-hidden transition-all duration-300 border-2",
            photoDataURL 
              ? "border-slate-100 shadow-sm" 
              : "border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#c8922a]/50"
          )}
        >
          <CardContent className="p-0 flex items-center justify-center">
            {photoDataURL ? (
              <img
                src={photoDataURL}
                alt="Photo preview"
                className="h-[180px] w-[145px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-[180px] w-[145px] flex-col items-center justify-center gap-4 text-slate-400 p-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1 group-hover:bg-[#c8922a]/10 group-hover:text-[#c8922a] transition-colors">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider">No Photo</p>
                  <p className="text-[9px] font-medium leading-tight opacity-60">Upload required</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {!photoDataURL && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-[2px]">
            <Button 
              type="button"
              size="sm" 
              variant="navy" 
              className="h-8 w-28 rounded-lg text-[10px] font-bold uppercase tracking-wider"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="h-3 w-3 mr-2" /> Camera
            </Button>
            <Button 
              type="button"
              size="sm" 
              variant="outline" 
              className="h-8 w-28 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-3 w-3 mr-2" /> Select
            </Button>
          </div>
        )}
      </div>

      {!photoDataURL && (
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider sm:hidden"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-3.5 w-3.5 mr-2" /> Camera
          </Button>
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-xl text-[10px] font-bold uppercase tracking-wider sm:hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-3.5 w-3.5 mr-2" /> Select
          </Button>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileSelect}
        ref={cameraInputRef}
        className="hidden"
      />
      
      <p className="text-[9px] text-slate-400 font-medium text-center uppercase tracking-widest">
        JPG, PNG · Max 5MB
      </p>
    </div>
  );
}

export default PhotoUploadSection;
