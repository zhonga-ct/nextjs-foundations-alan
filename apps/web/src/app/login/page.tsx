import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-2xl">Log In</h1>
      <p className="mb-4 text-gray-600">
        Demo login: enter any name to get a session cookie. /protected
        redirected you here because you had no session.
      </p>

      <form action={login} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </main>
  );
}
