import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { InputField } from "./InputField";
import { admissionSchema, type AdmissionFormData } from "../utils/formSchema";
import { updateApplication, type ApplicationData } from "../services/supabase";
import { PhotoUploadSection } from "./PhotoUploadSection";

interface EditApplicationModalProps {
  app: ApplicationData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditApplicationModal = ({
  app,
  open,
  onOpenChange,
  onSuccess,
}: EditApplicationModalProps) => {
  const [photoDataURL, setPhotoDataURL] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const selectedStream = watch("stream");

  const getClassOptions = () => {
    switch (selectedStream) {
      case "Root Exc":
        return ["Class 8", "Class 9", "Class 10"];
      case "HS":
        return ["Plus One", "Plus Two"];
      case "BS":
        return ["Degree 1st Year", "Degree 2nd Year", "Degree 3rd Year"];
      case "AD":
        return ["AD 1st Year", "AD 2nd Year", "AD 3rd Year", "AD 4th Year", "AD 5th Year"];
      case "PG":
        return ["PG 1st Year", "PG 2nd Year"];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (app && open) {
      reset({
        firstName: app.firstName,
        lastName: app.lastName,
        dob: app.dob,
        bloodGroup: app.bloodGroup || "",
        nationality: app.nationality || "Indian",
        aadhar: app.aadhar || "",
        studentPhone: app.studentPhone || "",
        address: app.address,
        applyClass: app.applyClass,
        academicYear: app.academicYear,
        stream: app.stream || "",
        prevSchool: app.prevSchool || "",
        prevClass: app.prevClass || "",
        prevBoard: app.prevBoard || "",
        prevPercentage: app.prevPercentage || "",
        achievements: app.achievements || "",
        fatherName: app.fatherName,
        fatherOcc: app.fatherOcc || "",
        fatherPhone: app.fatherPhone,
        fatherEmail: app.fatherEmail || "",
        motherName: app.motherName || "",
        motherOcc: app.motherOcc || "",
        motherPhone: app.motherPhone || "",
        motherEmail: app.motherEmail || "",
        income: app.income || "",
        emergencyName: app.emergencyName || "",
        emergencyPhone: app.emergencyPhone || "",
        medical: app.medical || "",
        referral: app.referral || "",
        remarks: app.remarks || "",
        agreeCheck: true, // Admin bypass
      });
      setPhotoDataURL(app.photo || app.photoUrl || null);
    }
  }, [app, open, reset]);

  const onSubmit = async (data: AdmissionFormData) => {
    if (!app?.id) return;
    setSubmitError(null);

    try {
      await updateApplication(app.id, {
        ...data,
        photo: photoDataURL?.startsWith("data:") ? photoDataURL : undefined,
        photoUrl: !photoDataURL?.startsWith("data:") ? photoDataURL : undefined,
      });
      onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error;
      setSubmitError(error.message || "Failed to update application.");
    }
  };

  if (!app) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-4xl h-[90vh] overflow-y-auto p-0 rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4 bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-display font-bold text-[#0a1628]">
                Edit Application
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">Update details for {app.firstName} {app.lastName} (App No: {app.appNo})</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-slate-200"
            >
              <X className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 pt-6 space-y-10">
          {submitError && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-2xl flex gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {submitError}
            </div>
          )}

          {/* Section 1: Photo & Personal */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c8922a] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />
              Personal Information
            </h3>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="shrink-0">
                <PhotoUploadSection
                  photoDataURL={photoDataURL}
                  onPhotoUpload={setPhotoDataURL}
                />
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <InputField
                  label="First Name"
                  id="firstName"
                  registration={register("firstName")}
                  error={errors.firstName?.message}
                  required
                />
                <InputField
                  label="Last Name"
                  id="lastName"
                  registration={register("lastName")}
                  error={errors.lastName?.message}
                  required
                />
                <InputField
                  label="Date of Birth"
                  id="dob"
                  type="date"
                  registration={register("dob")}
                  error={errors.dob?.message}
                  required
                />
                <InputField
                  label="Blood Group"
                  id="bloodGroup"
                  type="select"
                  options={["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "AB-"]}
                  registration={register("bloodGroup")}
                  error={errors.bloodGroup?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <InputField
                label="Nationality"
                id="nationality"
                registration={register("nationality")}
                error={errors.nationality?.message}
              />
              <InputField
                label="Aadhar Number"
                id="aadhar"
                registration={register("aadhar")}
                error={errors.aadhar?.message}
                required
              />
              <InputField
                label="Student Phone"
                id="studentPhone"
                type="tel"
                registration={register("studentPhone")}
                error={errors.studentPhone?.message}
              />
              <div className="sm:col-span-2">
                <InputField
                  label="Residential Address"
                  id="address"
                  type="textarea"
                  registration={register("address")}
                  error={errors.address?.message}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c8922a] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />
              Academic Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InputField
                label="Applying Class"
                id="applyClass"
                type="select"
                options={getClassOptions()}
                registration={register("applyClass")}
                error={errors.applyClass?.message}
                required
              />
              <InputField
                label="Department"
                id="stream"
                type="select"
                options={["Root Exc", "HS", "BS", "N/A"]}
                registration={register("stream")}
                error={errors.stream?.message}
              />
              <InputField
                label="Academic Year"
                id="academicYear"
                type="select"
                options={["2026–27"]}
                registration={register("academicYear")}
                error={errors.academicYear?.message}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField
                label="Previous School"
                id="prevSchool"
                registration={register("prevSchool")}
                error={errors.prevSchool?.message}
                required
              />
              <InputField
                label="Previous Board"
                id="prevBoard"
                type="select"
                options={["Kerala State", "CBSE", "ICSE", "VHSE", "THSE", "NIOS", "Other"]}
                registration={register("prevBoard")}
                error={errors.prevBoard?.message}
              />
              <InputField
                label="Previous Class"
                id="prevClass"
                registration={register("prevClass")}
                error={errors.prevClass?.message}
              />
              <InputField
                label="Percentage (%)"
                id="prevPercentage"
                registration={register("prevPercentage")}
                error={errors.prevPercentage?.message}
              />
            </div>
          </div>

          {/* Section 3: Family */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c8922a] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />
              Parent / Guardian Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Father's Info</h4>
                <InputField label="Name" id="fatherName" registration={register("fatherName")} error={errors.fatherName?.message} required />
                <InputField label="Occupation" id="fatherOcc" registration={register("fatherOcc")} error={errors.fatherOcc?.message} />
                <InputField label="Phone" id="fatherPhone" type="tel" registration={register("fatherPhone")} error={errors.fatherPhone?.message} required />
                <InputField label="Email" id="fatherEmail" type="email" registration={register("fatherEmail")} error={errors.fatherEmail?.message} />
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mother's Info</h4>
                <InputField label="Name" id="motherName" registration={register("motherName")} error={errors.motherName?.message} required />
                <InputField label="Occupation" id="motherOcc" registration={register("motherOcc")} error={errors.motherOcc?.message} />
                <InputField label="Phone" id="motherPhone" type="tel" registration={register("motherPhone")} error={errors.motherPhone?.message} />
                <InputField label="Email" id="motherEmail" type="email" registration={register("motherEmail")} error={errors.motherEmail?.message} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <InputField
                label="Emergency Contact"
                id="emergencyName"
                registration={register("emergencyName")}
                error={errors.emergencyName?.message}
              />
              <InputField
                label="Emergency Phone"
                id="emergencyPhone"
                type="tel"
                registration={register("emergencyPhone")}
                error={errors.emergencyPhone?.message}
              />
              <InputField
                label="Annual Family Income"
                id="income"
                type="select"
                options={["Below ₹50,000", "₹50,000 - ₹1L", "₹1L - ₹2.5L", "₹2.5L - ₹5L", "Above ₹5L"]}
                registration={register("income")}
                error={errors.income?.message}
              />
            </div>
          </div>

          {/* Section 4: Additional */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#c8922a] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8922a]" />
              Additional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Medical Conditions" id="medical" type="textarea" registration={register("medical")} error={errors.medical?.message} />
              <InputField label="Referral" id="referral" registration={register("referral")} error={errors.referral?.message} />
            </div>
            <InputField label="Remarks" id="remarks" type="textarea" registration={register("remarks")} error={errors.remarks?.message} />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-slate-100 sticky bottom-0 bg-white pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl font-bold bg-[#0a1628] hover:bg-[#132238]"
            >
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApplicationModal;
