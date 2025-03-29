import { decodeBase64 } from "@/utils/crypto";

const promptsConstants = {
  mainPrompt: decodeBase64(process.env.MAIN_PROMPT),
  verifyTitleNamePrompt: decodeBase64(process.env.VERIFY_TITLE_NAME_PROMPT),
  suggestions: decodeBase64(process.env.SUGGESTIONS_PROMPT),
};

const aiConstants = {
  DEFAULT_AI: "gpt-4o",
  promptsConstants,
};

export default aiConstants;
