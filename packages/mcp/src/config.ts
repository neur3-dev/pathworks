import { z } from 'zod';

const ZConfig = z.object({
  PATHWORKS_API_URL: z.url().default('https://api.pathworks.com'),
  PATHWORKS_API_KEY: z.string().min(1),
  PATHWORKS_USER_AGENT: z.string().min(1).default('pathworks-mcp/0.0.9')
});

export type McpServerConfig = z.infer<typeof ZConfig>;

export function getConfig(env: NodeJS.ProcessEnv = process.env): McpServerConfig {
  return ZConfig.parse(env);
}
