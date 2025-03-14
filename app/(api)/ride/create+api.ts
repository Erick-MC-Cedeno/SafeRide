import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            origin_address,
            destination_address,
            origin_latitude,
            origin_longitude,
            destination_latitude,
            destination_longitude,
            ride_time,
            fare_price,
            payment_status,
            driver_id,
            user_id,
        } = body;

        if (
            !origin_address ||
            !destination_address ||
            !origin_latitude ||
            !origin_longitude ||
            !destination_latitude ||
            !destination_longitude ||
            !ride_time ||
            !fare_price ||
            !payment_status ||
            !driver_id ||
            !user_id
        ) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 },
            );
        }

        const sql = neon(`${process.env.DATABASE_URL}`);

        // Si ride_time viene como "5" (minutos), convertimos esa cantidad a un timestamp válido.
        const numericRideTime = parseInt(ride_time);
        // Calculamos la fecha actual más esos minutos
        const rideTimestamp = new Date(Date.now() + numericRideTime * 60000).toISOString();

        // Convertimos el user_id de Clerk (ejemplo: "user_2...") a un valor numérico
        const numericUserId = parseInt(user_id.replace("user_", ""));
        console.log("Numeric user id:", numericUserId);

        const response = await sql`
        INSERT INTO ride (
          origin_address, 
          destination_address, 
          origin_latitude, 
          origin_longitude, 
          destination_latitude, 
          destination_longitude, 
          ride_time, 
          fare_price, 
          payment_status, 
          driver_id, 
          user_id
        ) VALUES (
          ${origin_address},
          ${destination_address},
          ${origin_latitude},
          ${origin_longitude},
          ${destination_latitude},
          ${destination_longitude},
          ${rideTimestamp},
          ${fare_price},
          ${payment_status},
          ${driver_id},
          ${numericUserId}
        )
        RETURNING *;
        `;

        return Response.json({ data: response[0] }, { status: 201 });
    } catch (error) {
        console.error("Error inserting data into recent_rides:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}