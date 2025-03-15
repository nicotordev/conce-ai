enum RecaptchaError {
  NO_RESPONSE = "No response",
  INVALID_TOKEN = "Invalid token",
  ACTION_MISMATCH = "Action mismatch",
  SCORE_LESS_THAN_THRESHOLD = "Returned score less than threshold set",
  ASSESSMENT_FAILED = "Assessment failed",
  INVALID_PARAMETERS = "Invalid parameters",
}

// Label corresponding to assessment analysis.
enum RecaptchaLabel {
  NOT_BAD = "Not Bad",
  BAD = "Bad",
}

export { RecaptchaError, RecaptchaLabel };
