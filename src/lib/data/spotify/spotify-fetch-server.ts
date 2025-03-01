import { Session } from "next-auth";
import { redirect } from "next/navigation";

export async function spotifyFetch<T>(
  endpoint: string,
  session: Session,
  options: RequestInit = {},
  searchParams: { [key: string]: string | number | boolean } = {}
): Promise<
  | { data: T; status: number; ok: boolean }
  | { message: string; status: number; ok: boolean }
> {
  const baseUrl = "https://api.spotify.com/v1";

  const url = `${baseUrl}${endpoint}`;

  const params = new URLSearchParams(
    Object.entries(searchParams).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  );

  console.log("fetching", url, params.toString());

  const response = await fetch(`${url}?${params}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${
        session.accounts.spotify?.access_token as string
      }`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Spotify API error: ${response.status} ${response.statusText} - ${errorText}`
    );
    if (response.status === 401) {
      return redirect("/api/auth/signin");
    }
    throw new Error(
      `Spotify API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  if (response.status === 204) {
    return { message: "No content", status: 204, ok: true };
  }

  return { data: await response.json(), status: response.status, ok: true };
}
