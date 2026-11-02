import { createPost } from "./actions";

export default function NewPostPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 font-bold text-2xl">Create New Post</h1>

      <form action={createPost} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="content" className="block font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={5}
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Create Post
        </button>
      </form>
    </main>
  );
}
