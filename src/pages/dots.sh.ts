import fs from 'node:fs';

const script = fs.readFileSync("src/scripts/dots.sh");

export const GET = () => new Response(script);
