export async function POST(req) {
  const body = await req.json();

  return new Response(
    JSON.stringify({
      output: "تم تحليل الإشارة: " + body.input,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
