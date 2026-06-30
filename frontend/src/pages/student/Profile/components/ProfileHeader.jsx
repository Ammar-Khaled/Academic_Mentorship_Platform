import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Edit2, Save, X } from "lucide-react";

import { updateStudentProfile } from "@/api/student";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  university: z.string().max(100).optional(),
  major: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

function initials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "S";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function ProfileHeader({ profile, onProfileUpdated }) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      university: profile?.university ?? "",
      major: profile?.major ?? "",
      bio: profile?.bio ?? "",
    },
    mode: "onChange",
  });

  const { register, handleSubmit, formState: { errors, isDirty, isValid }, reset } = form;

  const handleSave = async (values) => {
    try {
      await updateStudentProfile({
        name: values.name,
        university: values.university,
        major: values.major,
        bio: values.bio,
      });
      setIsEditing(false);
      if (onProfileUpdated) onProfileUpdated();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    reset({
      name: profile?.name ?? "",
      university: profile?.university ?? "",
      major: profile?.major ?? "",
      bio: profile?.bio ?? "",
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Profile</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input id="university" placeholder="Where do you study?" {...register("university")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major / Program</Label>
                <Input id="major" placeholder="e.g. Computer Science" {...register("major")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" className="min-h-[100px]" placeholder="Tell us about yourself..." {...register("bio")} />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={!isDirty}>
                Cancel
              </Button>
              <Button type="submit" disabled={!isDirty || !isValid}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl">Profile</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit profile</span>
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
              <AvatarFallback className="bg-muted text-foreground">{initials(profile?.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 space-y-2">
              <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">{profile?.name ?? "—"}</h1>
              <p className="text-sm text-muted-foreground sm:text-base">
                {profile?.major ? `${profile.major}` : "—"}
                {profile?.university ? ` at ${profile.university}` : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-1 lg:gap-4 min-w-[200px]">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="mt-1 truncate text-sm font-semibold">{profile?.user?.email ?? "—"}</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Bio</div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {profile?.bio ?? "—"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Joined</div>
              <div className="mt-1 text-sm font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground">Last updated</div>
              <div className="mt-1 text-sm font-medium">
                {profile?.updatedAt
                  ? new Date(profile.updatedAt).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
