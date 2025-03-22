import { NicoDropzone } from "@nicotordev/nicodropzone";

const nicodropzone = new NicoDropzone(
  process.env.NICODROPZONE_BASE_URL,
  process.env.NICODROPZONE_API_KEY,
  "condor-ai"
);

export default nicodropzone;
