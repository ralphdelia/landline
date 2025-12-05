import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center font-sans">
      <main className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link 
          href="/" 
          className="text-blue-600 hover:underline font-medium"
        >
          Return to Home
        </Link>
      </main>
    </div>
  );
}
