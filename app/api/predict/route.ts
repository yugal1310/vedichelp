export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, dob, tob, place } = body;

    if (!dob || !tob || !place) {
      return Response.json(
        { error: "dob, tob, and place are required" },
        { status: 400 }
      );
    }

    return Response.json({
      input: { name, dob, tob, place },
      output: {
        themes: ["Discipline", "Structured growth"],
        personality: ["Analytical", "Focused"],
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
