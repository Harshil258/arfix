import React, { useMemo } from "react";
import { ProfileDetailsForm } from "@/components/forms/ProfileDetailsForm";
import { ChangePasswordForm } from "@/components/forms/ChangePasswordForm";
import { useAuthMeQuery } from "@/hooks/queries/auth.queries";
import {
  useChangeMyPasswordMutation,
  useUpdateMyProfileMutation,
} from "@/hooks/mutations/auth.mutations";
import type { ProfileUpdateFormValues, ChangePasswordFormValues } from "@/schemas/profile.schema";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/currentUserSlice";
import type { AppUserRole } from "@/api/userApi";
import { toast } from "react-toastify";

const apiErrorMessage = (e: unknown, fallback: string) => {
  if (e && typeof e === "object" && "message" in e) {
    return String((e as { message?: unknown }).message);
  }
  return fallback;
};

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.currentUser.token);

  const meQuery = useAuthMeQuery();
  const updateMutation = useUpdateMyProfileMutation();
  const passwordMutation = useChangeMyPasswordMutation();

  const me = meQuery.data;

  const profileDefaults = useMemo<ProfileUpdateFormValues | null>(() => {
    if (!me) return null;
    return {
      name: me.name,
      email: me.email,
      mobile: me.mobile?.trim() ?? "",
    };
  }, [me]);

  const profileFormKey = useMemo(() => {
    if (!me) return "loading";
    return [me.id, me.name, me.email, me.mobile ?? ""].join("|");
  }, [me]);

  const handleProfileSubmit = async (data: ProfileUpdateFormValues) => {
    try {
      const updated = await updateMutation.mutateAsync({
        name: data.name,
        email: data.email,
        mobile: data.mobile,
      });
      if (!token) {
        toast.error("Session expired. Please log in again.");
        return;
      }
      dispatch(
        setUser({
          token,
          user: {
            id: String(updated.id),
            name: updated.name,
            email: updated.email,
            role: updated.role as AppUserRole,
            mobile: updated.mobile?.trim() || undefined,
          },
        }),
      );
      toast.success("Profile updated successfully.");
    } catch (e: unknown) {
      toast.error(apiErrorMessage(e, "Unable to update profile."));
    }
  };

  const handlePasswordSubmit = async (data: ChangePasswordFormValues) => {
    try {
      await passwordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      toast.success("Password changed successfully.");
    } catch (e: unknown) {
      toast.error(apiErrorMessage(e, "Unable to change password."));
      throw e;
    }
  };

  if (meQuery.isLoading && !me) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        Loading profile…
      </div>
    );
  }

  if (meQuery.error || !me || !profileDefaults) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
        {apiErrorMessage(meQuery.error, "Unable to load your profile.")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {updateMutation.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {apiErrorMessage(updateMutation.error, "Unable to save profile. Please try again.")}
        </div>
      ) : null}

      <section className="rounded-xl border border-border bg-muted/30 p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Current details
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Name</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{me.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Email</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{me.email}</dd>
          </div>
          {me.mobile?.trim() ? (
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted-foreground">Mobile</dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">{me.mobile}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <ProfileDetailsForm
        key={profileFormKey}
        defaultValues={profileDefaults}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleProfileSubmit}
      />

      <ChangePasswordForm
        isSubmitting={passwordMutation.isPending}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default Profile;
