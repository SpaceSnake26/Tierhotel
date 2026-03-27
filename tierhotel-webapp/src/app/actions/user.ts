'use server'

export async function inviteUser(formData: FormData) {
   // To invite or create users programmatically, Supabase requires the Service Role Key.
   // Using the Anon key for auth.signUp allows normal user sign up, but doesn't immediately
   // fit an "Admin Invites User" flow without exposing auto-login side effects or needing extra logic.
   
   console.warn("User Invite Form payload:", Object.fromEntries(formData.entries()));
   throw new Error("Admin User Invitation requires Supabase Service Role configuration or integrating the standard Auth SignUp flow. For now, testing endpoints must be done individually via the standard sign up API.");
}
