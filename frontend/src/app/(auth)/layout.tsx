// Implement Later

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <div className="flex items-center justify-start">
        {/* Add Icon or change next line to custom image*/}
        <p className="font-bold tracking-widest text-lg">CLEARUP</p>
      </div>
      {children}
    </div>
  );
}
