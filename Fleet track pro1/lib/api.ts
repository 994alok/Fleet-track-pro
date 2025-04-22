// Truck type definitions
export interface Truck {
  id: number
  name: string
  number: string
  driver_name: string
  last_updated?: string
}

export interface TripSummary {
  trip_id: number
  truck_id: number
  trip_number: string
  total_expenses: number
  profit_loss: number
  last_updated: string
}

export interface TripDetails {
  trip_id: number
  truck_id: number
  trip_number: string
  start_date: string
  unloading_date: string
  loading_point: string
  unloading_point: string
  starting_km: number
  closing_km: number
  running_km: number
  eway_bill?: string
  lr_number?: string
  loading_halt_cost: number
  unloading_halt_cost: number
  rent: number
  driver_bata_percent: number
  driver_bata: number
  agent_name?: string
  agent_commission: number
  fastag_charges: number
  def_charges: number
  rto_charges: number
  other_expenses: number
  total_expenses: number
  profit_loss: number
  last_updated: string
  diesel_entries: DieselEntry[]
}

export interface DieselEntry {
  entry_id: number
  trip_id: number
  date: string
  time: string
  location: string
  litres_purchased: number
  price_per_litre: number
  total_cost: number
}

export interface NewTripPayload {
  truck: {
    name: string
    number: string
    driver_name: string
  }
  trip: {
    trip_number: string
    start_date: string
    unloading_date: string
    loading_point: string
    unloading_point: string
    starting_km: number
    closing_km: number
    eway_bill?: string
    lr_number?: string
  }
  costs: {
    loading_halt_cost: number
    unloading_halt_cost: number
    rent: number
    driver_bata_percent: number
    agent_name?: string
    agent_commission: number
    fastag_charges: number
    def_charges: number
    rto_charges: number
    other_expenses: number
  }
  diesel_entry: {
    date: string
    time: string
    location: string
    litres_purchased: number
    price_per_litre: number
  }
}

// API functions
export async function getTrucks(): Promise<Truck[]> {
  const response = await fetch("/trucks")
  if (!response.ok) {
    throw new Error("Failed to fetch trucks")
  }
  return response.json()
}

export async function getLatestTrip(truckId: number): Promise<TripSummary> {
  const response = await fetch(`/trucks/${truckId}/latest-trip`)
  if (!response.ok) {
    throw new Error("Failed to fetch latest trip")
  }
  return response.json()
}

export async function createTrip(tripData: NewTripPayload): Promise<{ message: string; trip_id: number }> {
  const response = await fetch("/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  })

  if (!response.ok) {
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create trip")
    } else {
      const errorText = await response.text()
      throw new Error(`Server error: ${response.status} ${response.statusText}. Details: ${errorText}`)
    }
  }

  const data = await response.json()
  return data
}
