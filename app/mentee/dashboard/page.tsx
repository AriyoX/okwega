import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { CheckCircle } from 'lucide-react';
import LogoutButton from "./LogoutButton";
import Image from "next/image";

export default async function Dashboard() {
  const supabase = await createClient();

  // Get auth user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/login");
  }

  // Get profile data including role and avatar
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, avatar_url')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          {profile?.avatar_url ? (
            <div className="relative w-16 h-16">
              <Image
                src={profile.avatar_url}
                alt="Profile Picture"
                width={64}
                height={64}
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xl">
                {user.email?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-600">
            Status: 
            {profile?.role === 'mentor' && profile?.verification_status === 'verified' ? (
              <span className="font-medium text-green-500 ml-2">
                Verified Mentor
                <CheckCircle className="inline-block ml-1 h-4 w-4" />
              </span>
            ) : (
              <span className="font-medium ml-2">
                {profile?.role ? `${profile.role}` : 'No role set'}
              </span>
            )}
          </p>
          
          <p className="text-gray-600">
            Weekly Availability Hours:{" "}
            <span className="font-medium">
              {profile?.weekly_availability_hours || 0} years
            </span>
          </p>
        </div>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}