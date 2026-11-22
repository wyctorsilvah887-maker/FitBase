import { LoadingScreen } from "@/components/app/LoadingScreen";

/** Mostrada pelo Next enquanto qualquer página sem loading próprio é carregada. */
export default function Loading() {
  return <LoadingScreen message="Carregando" />;
}
