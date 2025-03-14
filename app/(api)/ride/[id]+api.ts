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
        ride.ride_id,
        ride.origin_address,
        ride.destination_address,
        ride.origin_latitude,
        ride.origin_longitude,
        ride.destination_latitude,
        ride.destination_longitude,
        ride.ride_time,
        ride.fare_price,
        ride.payment_status,
        ride.created_at,
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
        ride
      INNER JOIN
        drivers ON ride.driver_id = drivers.id
      WHERE 
        ride.user_id = ${numericId}
      ORDER BY 
        ride.created_at DESC;
    `;

    console.log("Recent rides response:", response);
    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching recent rides:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}