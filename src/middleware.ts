import { createMiddleware } from 'hono/factory';

const encoder = new TextEncoder();

// Check if the request is coming from GitHub webhook
export const checkGhSignature = createMiddleware(async (c, next) => {
  const ghWebhookSecret = c.env.GITHUB_WEBHOOK_SECRET;
  console.log(ghWebhookSecret);
  try {
    const sigHex = c.req.header()['x-hub-signature-256'].split('=')[1];
    const algorithm = { name: 'HMAC', hash: { name: 'SHA-256' } };
    const keyBytes = encoder.encode(ghWebhookSecret);
    const extractable = false;
    const key = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      algorithm,
      extractable,
      ['sign', 'verify']
    );
    const sigBytes = hexToBytes(sigHex);
    const dataBytes = encoder.encode(JSON.stringify(await c.req.json()));
    const equal = await crypto.subtle.verify(
      algorithm.name,
      key,
      sigBytes,
      dataBytes
    );

    if (!equal) {
      return c.json({
        error: 'Unauthorized',
      });
    }

    await next();
  } catch (e) {
    console.log(e);
    return c.json({
      error: 'Unauthorized',
    });
  }
});

function hexToBytes(hex: string) {
  let len = hex.length / 2;
  let bytes = new Uint8Array(len);

  let index = 0;
  for (let i = 0; i < hex.length; i += 2) {
    let c = hex.slice(i, i + 2);
    let b = parseInt(c, 16);
    bytes[index] = b;
    index += 1;
  }

  return bytes;
}
