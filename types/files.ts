import { NicoDropzoneFile } from "@nicotordev/nicodropzone/dist/types";
import { IconType } from "react-icons/lib";

type CondorAIFile = NicoDropzoneFile & {
  name: string;
  src: string;
  type: string;
  nameWithoutExtension: string;
  sizeInMB: number;
  preview: string;
  icon: IconType;
  status: "uploading" | "uploaded" | "error";
};

export type { CondorAIFile };
