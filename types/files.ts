import { NicoDropzoneFile } from "@nicotordev/nicodropzone/dist/types";
import { IconType } from "react-icons/lib";

type CondorAIFile = NicoDropzoneFile & {
  icon: IconType;
  status: "uploading" | "uploaded" | "error";
};

export type { CondorAIFile };
