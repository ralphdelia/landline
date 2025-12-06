import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center font-sans">
      <section className="flex flex-col items-center justify-center p-8 text-center">
        <h1 className="mb-4 text-6xl font-bold">404</h1>
        <h2 className="mb-4 text-2xl font-semibold">Page Not Found</h2>
        <p className="mb-8 text-gray-600">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="font-medium text-blue-600 hover:cursor-pointer hover:underline"
        >
          Return to Home
        </Link>
      </section>
    </div>
  );
}
