import { adminDb } from "../_lib/firebase/firestore-admin";

const sampleVehicles = [
  {
    year: 2022,
    make: "Toyota",
    model: "Camry",
    vin: "1HGBH41JXMN109186",
    colour: "Pearl White",
    odometer: 35000,
    odometerUnit: "km" as const,
    transmission: "automatic" as const,
    fuelType: "petrol" as const,
    engineCapacity: 2.5,
    driveType: "2WD" as const,
    bodyType: "Sedan",
    seats: 5,
    doors: 4,
    condition: "excellent" as const,
    serviceHistory: "Full service history with authorized Toyota dealer",
    accidentHistory: "No accident history",
    modifications: "None",
    notes: "Well maintained, single owner vehicle",
    registrationExpiry: "2025-12-31",
    registrationNumber: "ABC123",
    listingType: "buy-now" as const,
    price: 28500,
    status: "active" as const,
    media: {
      images: ["image0.jpg", "image1.jpg", "image2.jpg"],
      primaryImage: "image0.jpg",
    },
  },
  {
    year: 2020,
    make: "Ford",
    model: "Ranger",
    vin: "2T1BF1K85LC123456",
    colour: "Magnetic Grey",
    odometer: 62000,
    odometerUnit: "km" as const,
    transmission: "automatic" as const,
    fuelType: "diesel" as const,
    engineCapacity: 3.2,
    driveType: "4WD" as const,
    bodyType: "Ute",
    seats: 5,
    doors: 4,
    condition: "good" as const,
    serviceHistory: "Regular servicing by Ford dealer",
    accidentHistory: "No major accidents",
    modifications: "Tow bar installed",
    notes: "Reliable workhorse, good towing capacity",
    registrationExpiry: "2025-08-15",
    registrationNumber: "XYZ789",
    listingType: "tender" as const,
    price: 0,
    reservePrice: 32000,
    tenderDeadline: "2025-12-15T23:59:59Z",
    status: "active" as const,
    media: {
      images: ["image0.jpg", "image1.jpg", "image2.jpg", "image3.jpg"],
      primaryImage: "image0.jpg",
    },
  },
  {
    year: 2023,
    make: "Mazda",
    model: "CX-5",
    vin: "JMZGF1BA3C0123456",
    colour: "Soul Red Metallic",
    odometer: 18000,
    odometerUnit: "km" as const,
    transmission: "automatic" as const,
    fuelType: "petrol" as const,
    engineCapacity: 2.0,
    driveType: "AWD" as const,
    bodyType: "SUV",
    seats: 5,
    doors: 5,
    condition: "excellent" as const,
    serviceHistory: "Covered under manufacturer warranty",
    accidentHistory: "No accident history",
    modifications: "None",
    notes: "Nearly new, low mileage, full warranty",
    registrationExpiry: "2026-06-30",
    registrationNumber: "MZD456",
    listingType: "buy-now" as const,
    price: 42500,
    status: "active" as const,
    media: {
      images: ["image0.jpg", "image1.jpg", "image2.jpg"],
      primaryImage: "image0.jpg",
    },
  },
  {
    year: 2019,
    make: "Holden",
    model: "Commodore",
    vin: "6G1BG5134F123456",
    colour: "Black",
    odometer: 85000,
    odometerUnit: "km" as const,
    transmission: "automatic" as const,
    fuelType: "petrol" as const,
    engineCapacity: 3.6,
    driveType: "2WD" as const,
    bodyType: "Sedan",
    seats: 5,
    doors: 4,
    condition: "fair" as const,
    serviceHistory: "Service history available",
    accidentHistory: "Minor cosmetic damage",
    modifications: "None",
    notes: "Good value sedan, some wear visible",
    registrationExpiry: "2025-04-20",
    registrationNumber: "HLD123",
    listingType: "tender" as const,
    price: 0,
    reservePrice: 15000,
    tenderDeadline: "2025-12-10T23:59:59Z",
    status: "draft" as const,
    media: {
      images: ["image0.jpg", "image1.jpg"],
      primaryImage: "image0.jpg",
    },
  },
  {
    year: 2021,
    make: "Hyundai",
    model: "i30",
    vin: "KMHEC4A47BU123456",
    colour: "Blue",
    odometer: 45000,
    odometerUnit: "km" as const,
    transmission: "automatic" as const,
    fuelType: "petrol" as const,
    engineCapacity: 1.6,
    driveType: "2WD" as const,
    bodyType: "Hatchback",
    seats: 5,
    doors: 5,
    condition: "good" as const,
    serviceHistory: "Regular servicing completed",
    accidentHistory: "No accident history",
    modifications: "Aftermarket wheels",
    notes: "Fuel efficient, great daily driver",
    registrationExpiry: "2025-09-10",
    registrationNumber: "HYD789",
    listingType: "buy-now" as const,
    price: 22000,
    status: "active" as const,
    media: {
      images: ["image0.jpg", "image1.jpg", "image2.jpg"],
      primaryImage: "image0.jpg",
    },
  },
  {
    year: 2018,
    make: "Volkswagen",
    model: "Golf",
    vin: "WVWZZ3CZ0JE123456",
    colour: "White",
    odometer: 72000,
    odometerUnit: "km" as const,
    transmission: "manual" as const,
    fuelType: "diesel" as const,
    engineCapacity: 1.6,
    driveType: "2WD" as const,
    bodyType: "Hatchback",
    seats: 5,
    doors: 5,
    condition: "good" as const,
    serviceHistory: "Regularly serviced by VW specialist",
    accidentHistory: "No major damage",
    modifications: "Lowered suspension",
    notes: "Fun to drive European hatchback",
    registrationExpiry: "2025-07-25",
    registrationNumber: "VW456",
    listingType: "tender" as const,
    price: 0,
    reservePrice: 18500,
    tenderDeadline: "2025-12-20T23:59:59Z",
    status: "active" as const,
    media: {
      images: ["image0.jpg", "image1.jpg", "image2.jpg", "image3.jpg"],
      primaryImage: "image0.jpg",
    },
  },
];

async function initVehicles() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("\n❌ Error: No admin UID provided");
    console.log("\nUsage:");
    console.log("  npm run init-vehicles <admin-uid>\n");
    console.log("Example:");
    console.log('  npm run init-vehicles "883jEfvHG7Pc6srpEauwB77D9293"\n');
    process.exit(1);
  }

  const adminUid = args[0];

  console.log(`\n🔧 Initializing Firestore vehicles collection with 6 sample vehicles...\n`);
  console.log(`   Admin UID: ${adminUid}\n`);

  try {
    const batch = adminDb.batch();
    const now = new Date().toISOString();

    sampleVehicles.forEach((vehicle, index) => {
      const docRef = adminDb.collection("vehicles").doc();
      batch.set(docRef, {
        ...vehicle,
        metadata: {
          createdBy: adminUid,
          createdAt: now,
          updatedAt: now,
        },
      });

      console.log(`   ✅ Prepared: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
    });

    await batch.commit();

    console.log("\n━".repeat(60));
    console.log(`\n✨ Successfully initialized ${sampleVehicles.length} vehicles!\n`);
    console.log(`📊 Summary:`);
    console.log(`   ✅ Created: ${sampleVehicles.length} vehicles`);
    console.log(`   📝 Listing types: 3 Buy-Now, 3 Tender`);
    console.log(`   📍 Statuses: 5 Active, 1 Draft`);
    console.log(`   🖼️  Images: Placeholder filenames (image0.jpg, etc.)\n`);
    console.log(`🎯 Next steps:`);
    console.log(`   1. Visit the Vehicles page in dealer portal`);
    console.log(`   2. Test filtering by listing type and status`);
    console.log(`   3. Implement Phase 3 CRUD operations\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Failed to initialize vehicles");
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
    process.exit(1);
  }
}

initVehicles().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
