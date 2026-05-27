import BrandedLoadingScreen from "@/components/BrandedLoadingScreen";

export default function AdminLoading() {
  return (
    <BrandedLoadingScreen
      title="Loading admin tools"
      subtitle="Preparing your dashboard and moderation tools."
      className="min-h-[50vh]"
    />
  );
}
