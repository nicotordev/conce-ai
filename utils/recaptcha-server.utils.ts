/**
 * *@license*
 * Copyright 2023 Google Inc. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import recaptchaConstants from "@/constants/recaptcha.constants";
import { RecaptchaError, RecaptchaLabel } from "@/types/recaptcha.enum";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";
import { google } from "@google-cloud/recaptcha-enterprise/build/protos/protos";
import logger from "@/lib/logger";

interface AssessmentResult {
  assessment: google.cloud.recaptchaenterprise.v1.IAssessment | null;
  error?: Error;
  success: boolean;
}

interface ValidationResult {
  label: RecaptchaLabel;
  reason: string;
  score?: number;
}

/**
 * Create an assessment to analyze the risk of a UI action.
 * @param projectId: GCloud Project ID
 * @param recaptchaSiteKey: Site key obtained by registering a domain/app to use recaptcha services.
 * @param token: The token obtained from the client on passing the recaptchaSiteKey.
 * @param expectedAction: The expected action for this type of event.
 * @returns AssessmentResult object containing assessment or error information
 */
async function createAssessment(
  projectId: string,
  recaptchaSiteKey: string,
  token: string,
  expectedAction: string
): Promise<AssessmentResult> {
  // Validar parámetros de entrada
  if (!projectId || !recaptchaSiteKey || !token || !expectedAction) {
    const error = new Error(RecaptchaError.INVALID_PARAMETERS);
    logger.error("reCAPTCHA assessment failed due to invalid parameters", {
      projectId: !!projectId,
      siteKeyProvided: !!recaptchaSiteKey,
      tokenProvided: !!token,
      actionProvided: !!expectedAction,
    });
    return { assessment: null, error, success: false };
  }

  try {
    const client = new RecaptchaEnterpriseServiceClient();

    // Build the assessment request.
    const [response] = await client.createAssessment({
      parent: `projects/${projectId}`,
      assessment: {
        // Set the properties of the event to be tracked.
        event: {
          siteKey: recaptchaSiteKey,
          token: token,
          expectedAction: expectedAction,
        },
      },
    });

    logger.info("reCAPTCHA assessment created successfully", {
      action: expectedAction,
      hasScore: !!response?.riskAnalysis?.score,
    });

    return { assessment: response, success: true };
  } catch (error) {
    logger.error("reCAPTCHA assessment creation failed", {
      error: error instanceof Error ? error.message : String(error),
      projectId,
      action: expectedAction,
    });
    return {
      assessment: null,
      error: error instanceof Error ? error : new Error(String(error)),
      success: false,
    };
  }
}

/**
 * Classify the action as BAD/NOT_BAD based on conditions specified.
 * @param assessmentResponse The response from reCAPTCHA assessment
 * @param recaptchaAction The expected action
 * @param threshold Optional custom threshold score (defaults to constant)
 * @returns ValidationResult with label, reason and score
 */
function checkForBadAction(
  assessmentResponse: google.cloud.recaptchaenterprise.v1.IAssessment | null,
  recaptchaAction: string,
  threshold: number = recaptchaConstants.SAMPLE_THRESHOLD_SCORE
): ValidationResult {
  // Inicializar resultado con valores por defecto
  const result: ValidationResult = {
    label: RecaptchaLabel.NOT_BAD,
    reason: "",
  };

  // Si no hay respuesta o propiedades del token
  if (!assessmentResponse || !assessmentResponse.tokenProperties) {
    result.reason = RecaptchaError.NO_RESPONSE;
    result.label = RecaptchaLabel.BAD;
    logger.warn("reCAPTCHA validation failed: No assessment response", {
      recaptchaAction,
    });
    return result;
  }

  const score = Number(assessmentResponse?.riskAnalysis?.score || 0);
  result.score = score;

  // Validar si el token es válido
  if (!assessmentResponse.tokenProperties.valid) {
    result.reason = RecaptchaError.INVALID_TOKEN;
    result.label = RecaptchaLabel.BAD;
    logger.warn("reCAPTCHA validation failed: Invalid token", {
      recaptchaAction,
    });
  }
  // Validar si la acción coincide con la esperada
  else if (assessmentResponse.tokenProperties.action !== recaptchaAction) {
    result.reason = RecaptchaError.ACTION_MISMATCH;
    result.label = RecaptchaLabel.BAD;
    logger.warn("reCAPTCHA validation failed: Action mismatch", {
      expected: recaptchaAction,
      received: assessmentResponse.tokenProperties.action,
    });
  }
  // Validar si el score es suficientemente alto
  else if (score <= threshold) {
    result.reason = RecaptchaError.SCORE_LESS_THAN_THRESHOLD;
    result.label = RecaptchaLabel.BAD;
    logger.warn("reCAPTCHA validation failed: Score below threshold", {
      score,
      threshold,
      recaptchaAction,
    });
  }

  // Si todo está bien, registrar éxito
  if (result.label === RecaptchaLabel.NOT_BAD) {
    logger.info("reCAPTCHA validation successful", { score, recaptchaAction });
  }

  return result;
}

/**
 * Wrapper function to create and validate a reCAPTCHA assessment in one call
 * @param projectId GCloud Project ID
 * @param recaptchaSiteKey Site key for reCAPTCHA
 * @param token Token from client
 * @param expectedAction Expected action name
 * @param threshold Optional custom threshold
 * @returns ValidationResult with assessment status
 */
async function validateRecaptcha(
  projectId: string,
  recaptchaSiteKey: string,
  token: string,
  expectedAction: string,
  threshold: number = recaptchaConstants.SAMPLE_THRESHOLD_SCORE
): Promise<ValidationResult> {
  const assessmentResult = await createAssessment(
    projectId,
    recaptchaSiteKey,
    token,
    expectedAction
  );

  if (!assessmentResult.success) {
    return {
      label: RecaptchaLabel.BAD,
      reason:
        assessmentResult.error?.message || RecaptchaError.ASSESSMENT_FAILED,
    };
  }

  return checkForBadAction(
    assessmentResult.assessment,
    expectedAction,
    threshold
  );
}

export { createAssessment, checkForBadAction, validateRecaptcha };
