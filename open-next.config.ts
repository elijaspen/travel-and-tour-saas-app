// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
	// Disable R2 caching for now to avoid binding issues
	// Can be enabled later when R2 bucket is properly configured
});
