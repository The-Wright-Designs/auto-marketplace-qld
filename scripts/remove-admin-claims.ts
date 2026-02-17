import { adminAuth } from "../_lib/firebase/firebase-admin";

async function removeAdminClaims() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("\n❌ Error: No user UIDs provided");
    console.log("\nUsage:");
    console.log("  npm run remove-admin-claims <uid1> <uid2> ...\n");
    console.log("Example:");
    console.log('  npm run remove-admin-claims "abc123def456" "xyz789uvw012"\n');
    process.exit(1);
  }

  console.log(`\n🔧 Removing admin claims for ${args.length} user(s)...\n`);

  const results = await Promise.allSettled(
    args.map(async (uid) => {
      try {
        await adminAuth.setCustomUserClaims(uid, {});

        const userRecord = await adminAuth.getUser(uid);
        console.log(`✅ Successfully removed admin claim for:`);
        console.log(`   UID: ${uid}`);
        console.log(`   Email: ${userRecord.email || "N/A"}`);
        console.log(`   Claims:`, userRecord.customClaims || "None");
        console.log();

        return { uid, success: true };
      } catch (error) {
        console.error(`❌ Failed to remove admin claim for UID: ${uid}`);
        console.error(`   Error: ${error instanceof Error ? error.message : error}`);
        console.log();
        return { uid, success: false, error };
      }
    })
  );

  const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
  const failed = results.length - successful;

  console.log("━".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log("\n⚠️  IMPORTANT NEXT STEPS:");
  console.log("   1. Users must log out and log back in for changes to take effect");
  console.log("   2. Users will lose access to admin-only features\n");

  process.exit(failed > 0 ? 1 : 0);
}

removeAdminClaims().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
