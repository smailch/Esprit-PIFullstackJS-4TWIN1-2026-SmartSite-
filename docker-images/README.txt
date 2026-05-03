Dossier d’export des images Docker (fichiers .tar)

Docker ne peut pas « enregistrer » les pulls directement dans le dépôt : les images sont
toujours dans le stockage de Docker Desktop. Pour garder une copie dans ce projet :

  PowerShell (depuis la racine du repo) :
    .\scripts\save-pismartsite-images.ps1

  Puis pour réimporter sur une autre machine :
    .\scripts\load-pismartsite-images.ps1

Les *.tar sont ignorés par Git (trop lourds). Copiez-les vous-même (clé USB, cloud, etc.).
