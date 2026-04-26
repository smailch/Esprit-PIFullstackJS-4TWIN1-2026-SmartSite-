/**
 * SonarQube self-hosted : le CLI attend le jeton via sonar.login.
 * La variable SONAR_TOKEN seule n'est pas toujours lue par le scanner Java.
 */
import { spawnSync } from "node:child_process";

const token = process.env.SONAR_TOKEN?.trim();
if (!token) {
  console.error(
    "SONAR_TOKEN manquant. Ex. PowerShell : $env:SONAR_TOKEN = \"sqp_...\"",
  );
  process.exit(1);
}

const host = process.env.SONAR_HOST_URL?.trim();
const passThrough = [`-Dsonar.login=${token}`];
if (host) passThrough.push(`-Dsonar.host.url=${host}`);

const isWin = process.platform === "win32";
const res = spawnSync(isWin ? "npx.cmd" : "npx", ["-y", "sonarqube-scanner", "--", ...passThrough], {
  stdio: "inherit",
  env: process.env,
  /** Sous Windows, shell:false peut lancer npx sans sortie ni code fiable. */
  shell: isWin,
});

if (res.error) {
  console.error(res.error);
  process.exit(1);
}
process.exit(res.status === null ? 1 : res.status ?? 1);
