# Admin Scripts

This directory contains administrative utility scripts for managing the Auto Marketplace QLD application.

## init-vehicles.ts

Initializes the Firestore `vehicles` collection with 6 sample vehicle listings for development and testing.

### Purpose

This script quickly populates your Firestore database with realistic sample vehicles, allowing you to:
- Test vehicle listing queries and filters
- Develop UI components for vehicle display
- Test pagination and sorting functionality
- Begin Phase 3 CRUD operations implementation

### Usage

```bash
npm run init-vehicles <admin-uid>
```

**Example:**
```bash
npm run init-vehicles "883jEfvHG7Pc6srpEauwB77D9293"
```

### Requirements

1. **Firebase Admin Credentials**: Must be configured in `.env.local`:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`

2. **Admin UID**: A valid Firebase user UID with admin claims set
   - Obtain from Firebase Console → Authentication → Users
   - Or use the UID you set with `set-admin-claims` script

3. **Dependencies**:
   - `tsx` package (already installed)
   - Firebase Admin SDK (already configured)

### What Gets Created

The script creates 6 diverse sample vehicles:

- **3 Buy-Now Listings**: Immediate purchase listings with fixed prices
- **3 Tender Listings**: Auction-style listings with reserve prices and deadlines
- **5 Active, 1 Draft**: Mix of published and draft statuses
- **Realistic Data**: Australian makes (Toyota, Ford, Mazda, Holden, Hyundai, VW)
- **Placeholder Images**: All vehicles have `image0.jpg`, `image1.jpg`, etc. filenames

### Process

1. Run the script with your admin UID
2. Script creates batch operation with 6 vehicle documents
3. Each vehicle includes:
   - Complete vehicle specifications (23 basic info fields)
   - Listing details (type, price, reserve price, deadline)
   - Status and media information
   - Metadata (createdBy, createdAt, updatedAt)
4. All documents added to Firestore `vehicles` collection in single batch

### Sample Vehicle Breakdown

| Make | Model | Year | Type | Price | Status |
|------|-------|------|------|-------|--------|
| Toyota | Camry | 2022 | Buy-Now | $28,500 | Active |
| Ford | Ranger | 2020 | Tender | $32,000* | Active |
| Mazda | CX-5 | 2023 | Buy-Now | $42,500 | Active |
| Holden | Commodore | 2019 | Tender | $15,000* | Draft |
| Hyundai | i30 | 2021 | Buy-Now | $22,000 | Active |
| Volkswagen | Golf | 2018 | Tender | $18,500* | Active |

*Reserve price shown

### After Running

Once complete:
1. Check Firebase Console → Firestore → `vehicles` collection
2. You should see 6 documents with all vehicle data
3. Ready to:
   - Create Firestore indexes
   - Begin Phase 3 CRUD operations
   - Develop vehicle management UI

### Security Notes

- Uses the provided admin UID for all vehicle `createdBy` fields
- Metadata timestamps set to current time in ISO format
- All operations use Firebase Admin SDK with proper authentication
- Safe to run multiple times (creates new documents each time)

### Troubleshooting

**Error: "Service account object must contain a string 'project_id' property"**
- Ensure `.env.local` contains all three Firebase Admin credentials
- Check that the script is using `--env-file=.env.local` flag

**Error: "auth/user-not-found"**
- Verify the admin UID is valid
- Check Firebase Console → Authentication → Users

**Documents not appearing**
- Check Firebase Console → Firestore Database → Collections
- Verify you're looking at the correct Firebase project
- Check browser cache (hard refresh)

---

## Vehicle CRUD Operations

All vehicle management operations are implemented in `_actions/vehicle-actions.ts` as server actions.

### Usage in Client Components

```typescript
import {
  createVehicle,
  getVehicle,
  listVehicles,
  updateVehicle,
  deleteVehicle,
  uploadVehicleImages,
  deleteVehicleImage,
} from "@/_actions/vehicle-actions";

// Create a new vehicle
const result = await createVehicle({
  year: 2023,
  make: "Toyota",
  model: "Camry",
  vin: "VIN123456789",
  colour: "White",
  // ... other fields
  listingType: "buy-now",
  price: 28500,
  images: ["image0.jpg"],
  primaryImage: "image0.jpg",
});

if (result.success) {
  console.log("Created vehicle:", result.data?.id);
} else {
  console.error(result.error);
}

// Fetch a vehicle
const vehicleResult = await getVehicle("vehicleId123");

// List vehicles with filters
const listResult = await listVehicles({
  listingType: "tender",
  status: "active",
  limit: 20,
  offset: 0,
});

// Update a vehicle
const updateResult = await updateVehicle("vehicleId123", {
  price: 27500,
  status: "active",
});

// Delete a vehicle (soft delete by default)
const deleteResult = await deleteVehicle("vehicleId123");

// Hard delete with image cleanup
const hardDeleteResult = await deleteVehicle("vehicleId123", true);

// Upload images
const uploadResult = await uploadVehicleImages("vehicleId123", [
  "image2.jpg",
  "image3.jpg",
]);

// Delete an image
const deleteImageResult = await deleteVehicleImage(
  "vehicleId123",
  "image0.jpg"
);
```

### Response Structure

All actions return a consistent response structure:

```typescript
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Available Server Actions

#### `createVehicle(input: CreateVehicleInput)`

Creates a new vehicle listing.

**Requirements:**
- User must have admin claim (`admin: true`)
- Input must validate against `createVehicleSchema`

**Returns:**
- Success: `{ id: string }` - The created vehicle's ID
- Error: Error message if validation fails or user lacks permissions

#### `getVehicle(vehicleId: string)`

Fetches a single vehicle by ID.

**Returns:**
- Success: `Vehicle` - Full vehicle object
- Error: "Vehicle not found" or error message

#### `listVehicles(filters?: ListVehiclesFilters)`

Lists vehicles with optional filtering and pagination.

**Filters:**
```typescript
interface ListVehiclesFilters {
  listingType?: "tender" | "buy-now";
  status?: "draft" | "active" | "sold" | "delisted";
  limit?: number;        // Default: 20
  offset?: number;       // Default: 0
}
```

**Returns:**
- Success: `Vehicle[]` - Array of matching vehicles
- Error: Error message

#### `updateVehicle(vehicleId: string, input: UpdateVehicleInput)`

Updates an existing vehicle.

**Requirements:**
- User must have admin claim
- Input is partial - only provided fields are updated
- Images in input are merged with existing images

**Returns:**
- Success: `{ id: string }`
- Error: "Vehicle not found" or error message

#### `deleteVehicle(vehicleId: string, hardDelete?: boolean)`

Deletes a vehicle.

**Behavior:**
- **Soft delete** (default): Changes status to "delisted", preserves data
- **Hard delete**: Removes document and all Storage images

**Requirements:**
- User must have admin claim

**Returns:**
- Success: `{ id: string }`
- Error: "Vehicle not found" or error message

#### `uploadVehicleImages(vehicleId: string, imageUrls: string[])`

Adds images to a vehicle's media array.

**Requirements:**
- User must have admin claim
- Vehicle must exist

**Returns:**
- Success: `{ images: string[] }` - All images (existing + new)
- Error: "Vehicle not found" or error message

#### `deleteVehicleImage(vehicleId: string, imageName: string)`

Removes an image from a vehicle.

**Behavior:**
- Deletes image from Storage
- Updates media array in Firestore
- If deleted image was primary, updates primary image to first remaining image

**Requirements:**
- User must have admin claim
- Vehicle must exist

**Returns:**
- Success: `{ images: string[] }` - Remaining images
- Error: "Vehicle not found" or error message

---

## set-admin-claims.ts

Sets admin custom claims on Firebase users to grant owner/admin access to the dealer portal vehicle management features.

### Purpose

This script grants the `admin: true` custom claim to specified Firebase users, allowing them to:
- Access the "Vehicles" page in the dealer portal
- Manage vehicle listings for tenders and immediate purchase
- Perform owner-specific administrative tasks

### Usage

```bash
npm run set-admin-claims <uid1> <uid2> ...
```

**Example:**
```bash
npm run set-admin-claims "883jEfvHG7Pc6srpEauwB77D9293" "vABl2i5z17TpzBuPhDSPjZ79HK52"
```

### Requirements

1. **Firebase Admin Credentials**: Must be configured in `.env.local`:
   - `FIREBASE_ADMIN_PROJECT_ID`
   - `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `FIREBASE_ADMIN_PRIVATE_KEY`

2. **User UIDs**: Obtain from Firebase Console → Authentication → Users

3. **Dependencies**:
   - `tsx` package (already installed)
   - Firebase Admin SDK (already configured)

### Process

1. Get user UIDs from Firebase Console
2. Run the script with UIDs as arguments
3. Script sets `admin: true` custom claim on each user
4. **Users must log out and log back in** for claims to take effect
5. Verify by checking if "Vehicles" appears in dealer portal navigation

### How It Works

The script:
1. Accepts Firebase user UIDs as command-line arguments
2. Uses Firebase Admin SDK to set custom claims
3. Verifies the claim was set successfully
4. Displays success/failure summary

Custom claims are added to the user's JWT token and are available throughout the application via `user.customClaims.admin`.

### Security Notes

- **Safe to commit**: No secrets or credentials are stored in this file
- **Requires authentication**: Can only run with valid Firebase Admin credentials
- **Audit trail**: All admin actions are logged by Firebase
- **Restricted access**: Only users with server access and Firebase credentials can run this
- **Explicit UIDs required**: Must provide specific user UIDs - no wildcards or bulk operations

### Related Code

- **Helper function**: `isAdmin()` in `_lib/auth/get-current-user.ts`
- **Navigation filter**: Uses `user?.customClaims?.admin` check in dashboard navigation components
- **Page protection**: `/dealer-portal/vehicles/page.tsx` uses `isAdmin()` to verify access

### Troubleshooting

**Error: "Service account object must contain a string 'project_id' property"**
- Ensure `.env.local` contains all three Firebase Admin credentials
- Check that the script is using `--env-file=.env.local` flag in package.json

**Error: "auth/user-not-found"**
- Verify the UID exists in Firebase Console
- Ensure you copied the UID correctly (no extra spaces)

**Changes not taking effect**
- Users must log out and log back in to refresh their authentication token
- Check browser console for any errors
- Verify claim was set by checking Firebase Console → Authentication → Users → Custom Claims
