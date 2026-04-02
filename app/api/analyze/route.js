export async function POST(req) {
  const body = await req.json();

  return Response.json({
    output: "تم تحليل الإشارة: " + body.input,
  });
}
