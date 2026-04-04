import { redirect } from "next/navigation";

/** Le module Jobs a été retiré ; la sidebar conserve le lien vers les tâches projet. */
export default function JobsRedirectPage() {
  redirect("/tasks");
}
