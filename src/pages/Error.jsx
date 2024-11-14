import { useRouteError } from "react-router-dom";
import LogoX from "../components/LogoX/LogoX";

export default function Error() {
  // Variables

  const error = useRouteError();

  return (
    <div className="flex flex-col gap-5 h-screen justify-center items-center">
      <LogoX />
      <h1 className="text-3xl font-bold">Erreur {error.status}</h1>
      <p>
        <span>Erreur :</span> {error.error ? error.error.message : error.message}
      </p>
      <a
        href="/"
        className="inline-block mx-auto uppercase px-10 py-4 text-white font-semibold text-xl mt-5 hover:bg-slate-700 rounded-full p-2">
        Retour à l&apos;accueil
      </a>
    </div>
  );
}
