import RequireSession from "@/components/auth/RequireSession";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireSession>{children}</RequireSession>;
}
