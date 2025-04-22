import jsPDF from "jspdf"
import "jspdf-autotable"
import type { Trip } from "./actions"
import { formatCurrency, formatDate } from "./utils"

// Add type definition for jsPDF with autotable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export const generateTripPDF = (trip: Trip): jsPDF => {
  // Initialize PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text(`Trip Details: ${trip.trip_number}`, 14, 22)

  // Add trip date range
  doc.setFontSize(12)
  doc.setTextColor(80, 80, 80)
  doc.text(`${formatDate(trip.start_date)} to ${formatDate(trip.unloading_date)}`, 14, 32)

  // Add truck and driver info
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Truck & Driver Information", 14, 45)

  doc.setFontSize(10)
  doc.setTextColor(80, 80, 80)

  const truckInfo = [
    ["Truck Name", trip.truck_name],
    ["Truck Number", trip.truck_number],
    ["Driver 1", trip.driver1_name],
    ["Driver 2", trip.driver2_name || "N/A"],
  ]

  doc.autoTable({
    startY: 50,
    head: [["Field", "Value"]],
    body: truckInfo,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244], textColor: 255 },
    margin: { left: 14 },
  })

  // Add trip route information
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Trip Route Information", 14, doc.autoTable.previous.finalY + 15)

  const routeInfo = [
    ["Loading Point", trip.loading_point],
    ["Unloading Point", trip.unloading_point],
    ["Starting KM", trip.starting_km.toString()],
    ["Closing KM", trip.closing_km.toString()],
    ["Running KM", trip.running_km.toString()],
    ["E-Way Bill", trip.eway_bill || "N/A"],
    ["LR Number", trip.lr_number || "N/A"],
  ]

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [["Field", "Value"]],
    body: routeInfo,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244], textColor: 255 },
    margin: { left: 14 },
  })

  // Add financial information
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Financial Information", 14, doc.autoTable.previous.finalY + 15)

  const financialInfo = [
    ["Rent (Revenue)", formatCurrency(Number(trip.rent))],
    ["Total Expenses", formatCurrency(Number(trip.total_expenses))],
    ["Profit/Loss", formatCurrency(Number(trip.profit_loss))],
    ["Profit Margin", `${Math.round((Number(trip.profit_loss) / Number(trip.rent)) * 100)}%`],
  ]

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [["Field", "Value"]],
    body: financialInfo,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244], textColor: 255 },
    margin: { left: 14 },
  })

  // Add expense breakdown
  doc.setFontSize(14)
  doc.setTextColor(40, 40, 40)
  doc.text("Expense Breakdown", 14, doc.autoTable.previous.finalY + 15)

  const expenseInfo = [
    ["Driver Bata", formatCurrency(Number(trip.driver_bata_amount))],
    ["Agent Commission", formatCurrency(Number(trip.agent_commission_amount || 0))],
    ["Diesel Cost", formatCurrency(Number(trip.diesel_cost))],
    ["FASTag Charges", formatCurrency(Number(trip.fastag_charges))],
    ["DEF Charges", formatCurrency(Number(trip.def_charges))],
    ["RTO Charges", formatCurrency(Number(trip.rto_charges))],
    ["Loading Halt Cost", formatCurrency(Number(trip.loading_halt_cost))],
    ["Unloading Halt Cost", formatCurrency(Number(trip.unloading_halt_cost))],
    ["Police Commission", formatCurrency(Number(trip.police_commission))],
    ["Other Expenses", formatCurrency(Number(trip.other_expenses_amount))],
  ]

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 20,
    head: [["Expense Category", "Amount"]],
    body: expenseInfo,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244], textColor: 255 },
    margin: { left: 14 },
  })

  // Add diesel entries if available
  if (trip.diesel_entries && trip.diesel_entries.length > 0) {
    // Add a new page if needed
    if (doc.autoTable.previous.finalY > 230) {
      doc.addPage()
    } else {
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text("Diesel Entries", 14, doc.autoTable.previous.finalY + 15)
    }

    const dieselEntries = trip.diesel_entries.map((entry, index) => [
      (index + 1).toString(),
      formatDate(entry.date),
      entry.time,
      entry.location,
      `${entry.litres_purchased.toFixed(2)} L`,
      `₹${entry.price_per_litre.toFixed(2)}`,
      formatCurrency(entry.total_cost),
    ])

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [["#", "Date", "Time", "Location", "Litres", "Rate", "Total"]],
      body: dieselEntries,
      theme: "grid",
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      margin: { left: 14 },
      styles: { fontSize: 8 },
    })
  }

  // Add notes if available
  if (trip.other_expenses_text) {
    // Add a new page if needed
    if (doc.autoTable.previous.finalY > 250) {
      doc.addPage()
    }

    doc.setFontSize(14)
    doc.setTextColor(40, 40, 40)
    doc.text("Notes", 14, doc.autoTable.previous.finalY + 15)

    doc.setFontSize(10)
    doc.setTextColor(80, 80, 80)
    doc.text(trip.other_expenses_text, 14, doc.autoTable.previous.finalY + 25, {
      maxWidth: 180,
    })
  }

  // Add footer with generation date
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.height - 10,
    )
  }

  return doc
}
