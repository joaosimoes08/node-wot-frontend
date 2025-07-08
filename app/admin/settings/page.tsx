import SettingsPage from "./components/SettingsPage";
import { getSystemInfo } from "@/lib/system";

export default async function Settings() {
  const systemInfo = getSystemInfo();

  return <SettingsPage systemInfo={systemInfo} />;
}