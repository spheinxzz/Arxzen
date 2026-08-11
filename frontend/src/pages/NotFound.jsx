import {
  Link,
} from "react-router-dom";


function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07090d] px-5 text-white">

      <div className="text-center">

        <p className="font-mono text-6xl font-bold text-zinc-800">
          404
        </p>

        <h1 className="mt-4 text-lg font-semibold">
          Page not found
        </h1>

        <p className="mt-2 text-xs text-zinc-700">
          The Arxzen page you're looking for doesn't exist.
        </p>

        <Link
          to="/home"
          className="mt-6 inline-flex rounded-lg bg-blue-500 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-400"
        >
          Return to dashboard
        </Link>

      </div>

    </main>
  );
}

export default NotFound;