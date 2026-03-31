"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  backLink?: string;           // optionnel : chemin pour un bouton "Retour"
  backLabel?: string;          // texte personnalisé pour le bouton retour
  children?: React.ReactNode;  // pour les actions (boutons, etc.)
  className?: string;          // pour override si besoin
  gradient?: boolean;          // activer/désactiver le gradient subtil
}

export default function PageHeader({
  title,
  description,
  backLink,
  backLabel = "Back",
  children,
  className = "",
  gradient = true,
}: PageHeaderProps) {
  return (
    <div className={`mb-10 md:mb-12 ${className}`}>
     

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Titre + description */}
        <div className="space-y-3 max-w-3xl">
          <h1
            className="
              text-3xl sm:text-4xl lg:text-5xl 
              font-extrabold 
              tracking-tight 
              bg-gradient-to-r from-[#0b4f6c] to-[#0b4f6c]/90 
              bg-clip-text text-transparent
            "
          >
            {title}
          </h1>

          {description && (
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Zone actions (boutons + retour éventuel) */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Bouton Retour optionnel */}
          {backLink && (
            <a
              href={backLink}
              className="
                inline-flex items-center gap-2.5 
                px-6 py-3 
                bg-white dark:bg-gray-800 
                border border-gray-300 dark:border-gray-700 
                text-gray-700 dark:text-gray-300 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                hover:border-gray-400 dark:hover:border-gray-600
                rounded-2xl font-medium transition-all duration-200 
                shadow-sm hover:shadow
              "
            >
              <ArrowLeft size={18} />
              <span>{backLabel}</span>
            </a>
          )}

          {/* Actions personnalisées (boutons create, filter, etc.) */}
          {children && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}