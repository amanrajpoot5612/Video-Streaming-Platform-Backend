import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000, // simulate 1000 users
  duration: '30s',
};

export default function () {
  http.get('https://amanrajpoot-bugsy.vercel.app/'); // your site URL
  sleep(1);
}
