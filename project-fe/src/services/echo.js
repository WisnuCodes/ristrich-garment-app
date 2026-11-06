import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY || 'restrich_key_2026';
const wsHost = import.meta.env.VITE_REVERB_HOST || (typeof window !== 'undefined' ? window.location.hostname : '127.0.0.1') || '127.0.0.1';
const wsPort = parseInt(import.meta.env.VITE_REVERB_PORT || '8080', 10);
const wsScheme = import.meta.env.VITE_REVERB_SCHEME || 'http';
const isTLS = wsScheme === 'https';

export const echo = new Echo({
  broadcaster: 'reverb',
  key: reverbKey,
  wsHost: wsHost,
  wsPort: wsPort,
  wssPort: wsPort,
  forceTLS: isTLS,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
});

export default echo;
