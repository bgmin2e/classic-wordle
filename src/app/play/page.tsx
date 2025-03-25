import Play from "./play";

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = extractQueryParam(params.code);
  return <Play code={code} />;
}

function extractQueryParam(param: string | string[] | undefined): string {
  if (typeof param === "string") return param;
  if (Array.isArray(param)) return param[0] ?? "";
  return "";
}
