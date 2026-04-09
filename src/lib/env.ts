export const env = {
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '',
  convexUrl: process.env.EXPO_PUBLIC_CONVEX_URL ?? '',
};

export const hasClerk = env.clerkPublishableKey.length > 0;
export const hasConvex = env.convexUrl.length > 0;
