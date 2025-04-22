"use server"

import { createServerSupabaseClient } from "./supabase"

// Type definitions
export interface DieselEntry {
  date: string
  time: string
  location: string
  litres_purchased: number
  price_per_litre: number
  total_cost: number
}

export interface Trip {
  id?: string
  trip_number: string
  truck_name: string
  truck_number: string
  driver1_name: string
  driver2_name?: string
  start_date: string
  unloading_date: string
  loading_point: string
  unloading_point: string
  starting_km: number
  closing_km: number
  running_km: number
  eway_bill?: string
  lr_number?: string
  rent: number
  total_expenses: number
  profit_loss: number
  driver_bata_amount: number
  driver_bata_type: string
  driver_bata_percent?: number
  agent_name?: string
  agent_mobile?: string
  agent_commission_amount?: number
  diesel_cost: number
  fastag_charges: number
  def_charges: number
  rto_charges: number
  other_expenses_amount: number
  police_commission: number
  loading_halt_cost: number
  unloading_halt_cost: number
  other_expenses_text?: string
  diesel_entries: DieselEntry[]
}

// Fetch all trips from Supabase
export async function getTrips(): Promise<Trip[]> {
  try {
    const supabase = createServerSupabaseClient()

    // Fetch trips
    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("*")
      .order("created_at", { ascending: false })

    if (tripsError) {
      console.error("Error fetching trips:", tripsError)
      return []
    }

    // If no trips exist yet, return an empty array
    if (!trips || trips.length === 0) {
      return []
    }

    // For each trip, fetch its diesel entries
    const tripsWithDieselEntries = await Promise.all(
      trips.map(async (trip) => {
        const { data: dieselEntries, error: dieselError } = await supabase
          .from("diesel_entries")
          .select("*")
          .eq("trip_id", trip.id)

        if (dieselError) {
          console.error(`Error fetching diesel entries for trip ${trip.id}:`, dieselError)
          return { ...trip, diesel_entries: [] }
        }

        return { ...trip, diesel_entries: dieselEntries || [] }
      }),
    )

    return tripsWithDieselEntries
  } catch (error) {
    console.error("Error in getTrips:", error)
    return []
  }
}

// Fix the addTrip function to properly handle errors and return more detailed error messages

export async function addTrip(tripData: Trip): Promise<{ success: boolean; message: string; tripId?: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Extract diesel entries from the trip data
    const { diesel_entries, ...tripWithoutDieselEntries } = tripData

    // Insert the trip
    const { data: newTrip, error: tripError } = await supabase
      .from("trips")
      .insert(tripWithoutDieselEntries)
      .select()
      .single()

    if (tripError) {
      console.error("Error adding trip:", tripError)
      return {
        success: false,
        message: `Failed to add trip: ${tripError.message || JSON.stringify(tripError)}`,
      }
    }

    // Insert diesel entries with the trip ID
    if (diesel_entries && diesel_entries.length > 0 && newTrip) {
      const dieselEntriesWithTripId = diesel_entries.map((entry) => ({
        ...entry,
        trip_id: newTrip.id,
      }))

      const { error: dieselError } = await supabase.from("diesel_entries").insert(dieselEntriesWithTripId)

      if (dieselError) {
        console.error("Error adding diesel entries:", dieselError)
        // Even if diesel entries fail, the trip was added successfully
        return {
          success: true,
          message: `Trip added successfully, but diesel entries failed: ${dieselError.message || JSON.stringify(dieselError)}`,
          tripId: newTrip.id,
        }
      }
    }

    return {
      success: true,
      message: "Trip added successfully",
      tripId: newTrip?.id || `mock-${Date.now()}`,
    }
  } catch (error) {
    console.error("Error in addTrip:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
    }
  }
}

// Add these new functions after the addTrip function

export async function updateTrip(
  tripId: string,
  tripData: Partial<Trip>,
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // Extract diesel entries from the trip data if they exist
    const { diesel_entries, ...tripWithoutDieselEntries } = tripData as any

    // Update the trip
    const { error: tripError } = await supabase.from("trips").update(tripWithoutDieselEntries).eq("id", tripId)

    if (tripError) {
      console.error("Error updating trip:", tripError)
      return {
        success: false,
        message: `Failed to update trip: ${tripError.message || JSON.stringify(tripError)}`,
      }
    }

    // If diesel entries are provided, handle them
    if (diesel_entries && diesel_entries.length > 0) {
      // First delete existing diesel entries
      const { error: deleteError } = await supabase.from("diesel_entries").delete().eq("trip_id", tripId)

      if (deleteError) {
        console.error("Error deleting existing diesel entries:", deleteError)
        return {
          success: true,
          message: `Trip updated successfully, but there was an error updating diesel entries: ${deleteError.message}`,
        }
      }

      // Then insert new diesel entries
      const dieselEntriesWithTripId = diesel_entries.map((entry: any) => ({
        ...entry,
        trip_id: tripId,
      }))

      const { error: dieselError } = await supabase.from("diesel_entries").insert(dieselEntriesWithTripId)

      if (dieselError) {
        console.error("Error adding updated diesel entries:", dieselError)
        return {
          success: true,
          message: `Trip updated successfully, but there was an error adding new diesel entries: ${dieselError.message}`,
        }
      }
    }

    return { success: true, message: "Trip updated successfully" }
  } catch (error) {
    console.error("Error in updateTrip:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
    }
  }
}

export async function deleteTrip(tripId: string): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createServerSupabaseClient()

    // First delete associated diesel entries
    const { error: dieselError } = await supabase.from("diesel_entries").delete().eq("trip_id", tripId)

    if (dieselError) {
      console.error("Error deleting diesel entries:", dieselError)
      // Continue with trip deletion even if diesel entries deletion fails
    }

    // Then delete the trip
    const { error: tripError } = await supabase.from("trips").delete().eq("id", tripId)

    if (tripError) {
      console.error("Error deleting trip:", tripError)
      return {
        success: false,
        message: `Failed to delete trip: ${tripError.message || JSON.stringify(tripError)}`,
      }
    }

    return { success: true, message: "Trip deleted successfully" }
  } catch (error) {
    console.error("Error in deleteTrip:", error)
    return {
      success: false,
      message: `An unexpected error occurred: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
    }
  }
}
