import { config } from "@/fernway.config";

/** The app's "now". Use this instead of `new Date()`: the local data ends at this time. */
export const now = () => new Date(config.now);
