export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-dashboard flex min-h-svh flex-col">{children}</div>
  );
}
