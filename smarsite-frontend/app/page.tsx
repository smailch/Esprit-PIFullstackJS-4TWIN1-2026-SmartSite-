import { redirect } from "next/navigation";

/** Page d’accueil publique : vitrine espace client. Tableau de bord client : `/dashboard`. Espace équipe : `/home`. */
export default function RootPage() {
  redirect("/dashboard/clients");
}
