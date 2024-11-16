"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const username = formData.get("Username")?.toString();
  const country = formData.get("country")?.toString();
  const role = "user"; // Default role or use formData.get("role") if user-provided

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !username || !country) {
    return encodedRedirect("error", "/sign-up", "All fields are required");
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (signUpError) {
    console.error(signUpError.code + " " + signUpError.message);
    return encodedRedirect("error", "/sign-up", signUpError.message);
  }

  // Insert user details into the Users table
  const { data, error: insertError } = await supabase
    .from("Users_details")
    .insert([
      { email: email, username: username, country: country, role: role }
    ]).select();

  if (insertError) {
    console.error("Database insert error:", insertError.message);
    return encodedRedirect("error", "/sign-up", "Failed to insert user details.");
  }

  // Store role and country in the session
  const sessionCookies = cookies();
  (await sessionCookies).set("email", email);
  (await sessionCookies).set("role", role);
  (await sessionCookies).set("country", country);

  return redirect("/Blogs");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Fetch role and country from Users_details table based on email
  const { data, error: fetchError } = await supabase
    .from("Users_details")
    .select("role, country")
    .eq("email", email)
    .single();

  if (fetchError || !data) {
    console.error("Error fetching user details:", fetchError?.message || "No data");
    return encodedRedirect("error", "/sign-in", "Failed to fetch user details.");
  }

  // Store role, country, and email in session
  const sessionCookies = cookies();
  (await sessionCookies).set("email", email);
  (await sessionCookies).set("role", data.role);
  (await sessionCookies).set("country", data.country);

  return redirect("/Blogs");
};


// The remaining functions do not require session updates
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect("error", "/forgot-password", "Could not reset password");
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password"
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Password and confirm password are required");
  }

  if (password !== confirmPassword) {
    return encodedRedirect("error", "/protected/reset-password", "Passwords do not match");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return encodedRedirect("error", "/protected/reset-password", "Password update failed");
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Clear session cookies upon sign out
  const sessionCookies = cookies();
  (await sessionCookies).delete("email");
  (await sessionCookies).delete("role");
  (await sessionCookies).delete("country");

  return redirect("/");
};
