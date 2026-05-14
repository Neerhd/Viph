import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EmbedCode } from "./EmbedCode";

export default async function EmbedPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { storeId?: string };
  return <EmbedCode storeId={user?.storeId ?? ""} />;
}
