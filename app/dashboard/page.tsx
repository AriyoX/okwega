import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function Dashboard() {
  const supabase = await createClient();
  
  // Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect("/login");
  }

  // Get profile data including role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        
        <div className="space-y-2">
          <p className="text-gray-600">Email: <span className="font-medium">{user.email}</span></p>
          <p className="text-gray-600">Role: <span className="font-medium capitalize">{profile?.role || 'Not set'}</span></p>
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}