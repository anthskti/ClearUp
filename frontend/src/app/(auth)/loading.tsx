import BrandedLoadingScreen from "@/components/BrandedLoadingScreen";

export default function AuthLoading() {
  return (
    <BrandedLoadingScreen
      fullScreen
      title="Loading session"
      subtitle="Checking your ClearUp account."
    />
  );
}
