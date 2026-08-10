
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Welcome to Next Message
        </h1>

        <p className="mt-4 text-muted-foreground">
          Send and receive anonymous messages.
        </p>

        <Link
          href="/sign-up"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
