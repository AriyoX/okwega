import LogoutButton from './LogoutButton';

export default function ProfileHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left">{title}</h1>
      <LogoutButton />
    </div>
  );
}