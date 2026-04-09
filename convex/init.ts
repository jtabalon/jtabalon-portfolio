import { internal } from './_generated/api';
import { mutation } from './_generated/server';

import { demoSiteContent } from '../src/lib/resume-parser';

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query('profile').first();

    if (!existing) {
      await ctx.runMutation(internal.site.seedDemoContent, {});
    }

    return demoSiteContent.profile.name;
  },
});
