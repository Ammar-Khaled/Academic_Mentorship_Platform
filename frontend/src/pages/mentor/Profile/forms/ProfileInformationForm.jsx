import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { profileSchema } from "../schemas/profile.schema";
import { useUpdateMentorProfile } from "../hooks/useUpdateMentorProfile";
import { getErrorMessage } from "@/lib/api";

export function ProfileInformationForm({ profile }) {
  const mutation = useUpdateMentorProfile();

  const defaultValues = useMemo(
    () => ({
      name: profile?.name ?? "",
      title: profile?.title ?? "",
      bio: profile?.bio ?? "",
      hourlyRate: profile?.hourlyRate ?? 0,
    }),
    [profile],
  );

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    register,
    formState: { errors, isDirty, isValid },
    handleSubmit,
    reset,
  } = form;

  // When query data arrives, re-seed the form.
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function onSubmit(values) {
    // Only send fields allowed by UpdateMentorProfileDto
    mutation.mutate({
      name: values.name,
      title: values.title,
      bio: values.bio,
      hourlyRate: values.hourlyRate,
    });
  }

  const submitError = mutation.error ? getErrorMessage(mutation.error) : null;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your mentor profile details.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" {...register("name")} />
              {errors.name?.message ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" placeholder="e.g. Senior Frontend Engineer" {...register("title")} />
              {errors.title?.message ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" className="min-h-[140px]" placeholder="Write a short professional bio..." {...register("bio")} />
            {errors.bio?.message ? <p className="text-xs text-destructive">{errors.bio.message}</p> : null}
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
              <Input id="hourlyRate" type="number" min="0" step="1" {...register("hourlyRate")} />
              {errors.hourlyRate?.message ? <p className="text-xs text-destructive">{errors.hourlyRate.message}</p> : null}
            </div>
          </div>

          {submitError ? <div className="rounded-lg border border-border bg-card p-3 text-sm text-destructive">{submitError}</div> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => reset(defaultValues)} disabled={!isDirty || mutation.isPending}>
              Reset
            </Button>

            <Button type="submit" disabled={!isDirty || !isValid || mutation.isPending}>
              {mutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
