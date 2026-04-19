import Link from "next/link";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClientDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-2xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
            Espace client
          </p>
          <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Tableau de bord
          </h1>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-slate-400 sm:text-base">
            Accédez aux outils conçus pour visualiser votre projet et imaginer votre
            futur logement.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/dream-house" className="gap-2">
              <Sparkles className="size-5" aria-hidden />
              Dream House
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/15 bg-white/[0.04] text-slate-100 hover:bg-white/10">
            <Link href="/dashboard/clients" className="gap-2">
              <Home className="size-5" aria-hidden />
              Page d&apos;accueil client
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-slate-500">
          <Link
            href="/home"
            className={cn(
              "font-medium text-orange-400/90 underline-offset-4 hover:text-orange-300 hover:underline",
            )}
          >
            Espace équipe
          </Link>
        </p>
      </div>
    </main>
  );
}
