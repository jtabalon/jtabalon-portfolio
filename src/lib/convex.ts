import { ConvexReactClient } from 'convex/react';

import { env } from '@/lib/env';

let convexClient: ConvexReactClient | null = null;

export function getConvexClient() {
  if (!env.convexUrl) {
    return null;
  }

  if (!convexClient) {
    convexClient = new ConvexReactClient(env.convexUrl);
  }

  return convexClient;
}
