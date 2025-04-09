import { neon } from "@neondatabase/serverless";

export async function GET(request: Request, { id }: { id?: string }) {
  if (!id) {
    console.error("Missing id parameter");
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  console.log("Received user id:", id);

  const numericId = parseInt(id.replace("user_", ""));
  if (isNaN(numericId)) {
    console.error("Parsed numericId is NaN");
    return Response.json({ error: "Invalid user id" }, { status: 400 });
  }
  console.log("Parsed numericId:", numericId);

  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`
      SELECT
        rides.ride_id,
        rides.origin_address,
        rides.destination_address,
        rides.origin_latitude,
        rides.origin_longitude,
        rides.destination_latitude,
        rides.destination_longitude,
        rides.ride_time,
        rides.fare_price,
        rides.payment_status,
        rides.created_at,
        'driver', json_build_object(
          'driver_id', drivers.id,
          'first_name', drivers.first_name,
          'last_name', drivers.last_name,
          'profile_image_url', drivers.profile_image_url,
          'car_image_url', drivers.car_image_url,
          'car_seats', drivers.car_seats,
          'rating', drivers.rating
        ) AS driver 
      FROM 
        rides
      INNER JOIN
        drivers ON rides.driver_id = drivers.id
      WHERE 
        rides.user_id = ${numericId}
      ORDER BY 
        rides.created_at DESC;
    `;

    console.log("Recent rides response:", response);
    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching recent rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}