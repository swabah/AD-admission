/**
 * PhotoUploadSection Component
 * Handles photo upload with compression
 */

import { useRef, ChangeEvent } from "react";
import { handlePhotoUpload } from "../utils/imageCompression";

interface PhotoUploadSectionProps {
  photoDataURL: string | null;
  onPhotoUpload: (dataURL: string) => void;
}

const PhotoUploadSection = ({
  photoDataURL,
  onPhotoUpload,
}: PhotoUploadSectionProps) => {
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
    <div>
      <label
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--text-muted)",
          marginBottom: "7px",
        }}
      >
        Student Photo
      </label>
      <div className="photo-box" onClick={() => photoInputRef.current?.click()}>
        {photoDataURL ? (
          <img src={photoDataURL} alt="Photo preview" />
        ) : (
          <div className="photo-hint">
            <div className="cam-icon">📷</div>
            Upload Photo
            <small>JPG, PNG up to 5MB</small>
          </div>
        )}
      </div>
      <input
        type="file"
        id="photoInput"
        accept="image/*"
        onChange={handleFileSelect}
        ref={photoInputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default PhotoUploadSection;
