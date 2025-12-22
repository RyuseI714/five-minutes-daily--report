import { deleteReport } from "../actions"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params   // ★ Promise を await する

  await deleteReport(id)

  return new Response("OK")
}