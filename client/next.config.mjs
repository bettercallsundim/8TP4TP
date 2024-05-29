// const MillionLint = require('@million/lint');
// const million = require('million/compiler');
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false
// };
// module.exports = nextConfig;

import million from "million/compiler";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

export default million.next(nextConfig);
