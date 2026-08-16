import {
  THIRDPARTY_STANDARD_BASE64,
  THIRDPARTY_CCSID_BASE64,
  BANK_NORMAL_BASE64,
  BANK_TH_BASE64,
  BANK_BTH_BASE64,
  NBC_TEMPLATE,
  SERVICE_STANDARD_BASE64,
  SERVICE_NBC_BASE64
} from "../assets/templateData";

export type ThirdPartyVariant = "standard" | "ccsid";
export type ServiceVariant = "standard" | "nbc";
export type BankVariant = "normal" | "th" | "bth" | "nbc";

export interface TemplateProfile {
  /** Stable machine key, e.g. "thirdparty-standard" */
  key: string;
  /** Human readable name shown in the UI */
  label: string;
  /**
   * The placeholder PROJECT name baked into the template zip
   * (folder name, .project, restapi.descriptor, etc). Replaced wholesale
   * with `${apiName}` for every generated wrapper.
   */
  templateProject: string;
  /**
   * The placeholder SERVICE name baked into the template zip (the base
   * name without any _th/_bth/_expDS suffix). Replaced wholesale with
   * `apiName` for every generated wrapper.
   */
  templateService: string;
  /** Optional suffix appended to apiName to build the project name. */
  suffix: string;
  /** Base64-encoded ZIP bytes for this template. Empty until provided. */
  base64: string;
  /**
   * Bank wrapper templates skip the swagger-field auto-fill step and
   * instead have the user's drag-and-dropped swagger file inserted as-is.
   */
  isBank: boolean;
}

// ---------------------------------------------------------------------------
// Third-party wrapper templates
// ---------------------------------------------------------------------------
export const THIRDPARTY_PROFILES: Record<ThirdPartyVariant, TemplateProfile> = {
  standard: {
    key: "thirdparty-standard",
    label: "Third-Party Generic Routing",
    templateProject: "thirdPartyGenericRouting_expDS",
    templateService: "thirdPartyGenericRouting",
    suffix: "",
    base64: THIRDPARTY_STANDARD_BASE64,
    isBank: false
  },
  ccsid: {
    key: "thirdparty-ccsid",
    label: "Third-Party Generic Routing (CCSID)",
    templateProject: "thirdPartyGenericRouting_CCSID_expDS",
    templateService: "thirdPartyGenericRouting_CCSID",
    suffix: "",
    base64: THIRDPARTY_CCSID_BASE64,
    isBank: false
  }
};

// ---------------------------------------------------------------------------
// Service templates (e.g. NBC starter + standard service)
// ---------------------------------------------------------------------------
export const SERVICE_PROFILES: Record<ServiceVariant, TemplateProfile> = {
  standard: {
    key: "service-standard",
    label: "Service Template (Standard)",
    templateProject: "serviceTemplate_expDS",
    templateService: "serviceTemplate",
    suffix: "",
    base64: SERVICE_STANDARD_BASE64,
    isBank: false
  },
  nbc: {
    key: "service-nbc",
    label: "Service Template (NBC)",
    templateProject: "serviceTemplate_NBC_sys",
    templateService: "serviceTemplate",
    suffix: "",
    base64: SERVICE_NBC_BASE64,
    isBank: false
  }
};

// ---------------------------------------------------------------------------
// Bank wrapper templates
//
// templateProject / templateService below are set to match the sample
// reference project you shared (TransferClosureDepositAmend...). When you
// paste the real base64 for a bank variant in assets/templateData.ts, update
// templateProject / templateService here to match whatever placeholder
// project/service name is actually baked into that zip, e.g.:
//   normal -> project: "<Name>_expDS",     service: "<Name>"
//   th     -> project: "<Name>_th_expDS",  service: "<Name>"
//   bth    -> project: "<Name>_bth_expDS", service: "<Name>"
// ---------------------------------------------------------------------------
export const BANK_PROFILES: Record<BankVariant, TemplateProfile> = {
  normal: {
    key: "bank-normal",
    label: "Bank Wrapper (Normal)",
    templateProject: "TransferClosureDepositAmend_expDS",
    templateService: "TransferClosureDepositAmend",
    suffix: "",
    base64: BANK_NORMAL_BASE64,
    isBank: true
  },
  th: {
    key: "bank-th",
    label: "Bank Wrapper (TH)",
    templateProject: "TransferClosureDepositAmend_th_expDS",
    templateService: "TransferClosureDepositAmend",
    suffix: "",
    base64: BANK_TH_BASE64,
    isBank: true
  },
  bth: {
    key: "bank-bth",
    label: "Bank Wrapper (BTH)",
    templateProject: "TransferClosureDepositAmend_bth_expDS",
    templateService: "TransferClosureDepositAmend",
    suffix: "",
    base64: BANK_BTH_BASE64,
    isBank: true
  }
  ,
  nbc: {
    key: "bank-nbc",
    label: "Bank Wrapper (NBC)",
    templateProject: "TransferClosureDepositAmend_NBC_sys",
    templateService: "TransferClosureDepositAmend",
    suffix: "",
    base64: NBC_TEMPLATE,
    isBank: true
  }
};
