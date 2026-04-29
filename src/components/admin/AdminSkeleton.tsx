import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function AdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={`stat-${i}`} className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function AdminTableSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Table rows */}
      {[...Array(5)].map((_, i) => (
        <div key={`row-${i}`} className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-20" />
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      ))}
    </div>
  );
}

export function AdminSidebarSkeleton() {
  return (
    <div className="w-64 h-screen bg-[#0a1628] p-6 space-y-6">
      {/* Logo area */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
        <Skeleton className="h-6 w-32 bg-white/20" />
      </div>

      {/* Stats */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={`sidebar-stat-${i}`} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-3 w-16 bg-white/10" />
              <Skeleton className="h-4 w-8 bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-white/10" />
        <Skeleton className="h-10 w-full bg-red-500/20" />
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebarSkeleton />
      <div className="flex-1 p-8 space-y-6">
        <AdminStatsSkeleton />
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <AdminTableSkeleton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
