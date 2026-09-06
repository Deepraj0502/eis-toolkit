import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-bundle';
import YAML from 'yaml';
import html2pdf from 'html2pdf.js';
import { 
  Sparkles, 
  FileCode2, 
  FileDown, 
  AlertTriangle, 
  XCircle, 
  Lightbulb, 
  Code2,
  Layers
} from 'lucide-react';
import 'swagger-ui-dist/swagger-ui.css';

interface DiagnosticIssue {
  severity: 'Error' | 'Warning';
  message: string;
  line: number;
  col: number;
  suggestion: string;
}

interface OpenApiDocument {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    version?: string;
    description?: string;
    [key: string]: unknown;
  };
  paths?: Record<string, unknown>;
  [key: string]: unknown;
}

const DEFAULT_SPEC = `{
  "swagger" : "2.0",
  "info" : {
    "description" : "Developers may use this swagger specification to create an API for OPR Loan closure for secured loans through YBP",
    "version" : "1.0.0",
    "title" : "Swagger Specification for OPR Loan closure for secured loans through YBP",
    "termsOfService" : "Please refer to SBI Lotus Project usage policy at developer.sbilotus.com/tcs",
    "contact" : {
      "email" : "apisupport@api.sbilotus.com"
    }
  },
  "basePath" : "/TransferClosureDeposit/amend",
  "schemes" : [ "https" ],
  "consumes" : [ "application/json" ],
  "produces" : [ "application/json" ],
  "paths" : {
    "/accounts" : {
      "post" : {
        "tags" : [ "OPR Loan closure for secured loans through YBP" ],
        "summary" : "This operation is used for OPR Loan closure for secured loans through YBP",
        "description" : " This operation is used for OPR Loan closure for secured loans through YBP",
        "operationId" : "TransferClosureDepositAmend_expDS",
        "produces" : [ "application/json" ],
        "consumes" : [ "application/json" ],
        "parameters" : [ {
          "name" : "AccessToken",
          "type" : "string",
          "required" : true,
          "in" : "header",
          "description" : "Access token generated through the encryption process"
        }, {
          "name" : "PremiumAgriCustomerDetails",
          "description" : "OPR Loan closure for secured loans through YBP",
          "schema" : {
            "$ref" : "#/definitions/RequestDetails"
          },
          "in" : "body"
        } ],
        "responses" : {
          "200" : {
            "description" : "Success",
            "schema" : {
              "$ref" : "#/definitions/ResponseDetails"
            }
          },
          "401" : {
            "description" : "Unauthorized",
            "schema" : {
              "$ref" : "#/definitions/genericResponse"
            }
          }
        }
      }
    }
  },
  "definitions" : {
    "genericResponse" : {
      "properties" : {
        "REQUEST_REFERENCE_NUMBER" : {
          "type" : "string",
          "description" : "Unique Request Reference Number should be of format SBIXXYYDDDHHmmssSSSNNNNNN First 3 alphabets will always be SBI, XX will signify Channel Identifier (eg: LT for YONO channel),YYDDD will signify the Julian Date (eg: 26-02-2020 will be represented as 20057),HHmmssSSS will signify the current time in hours, minutes, second and milisecond,NNNNNN will signify running sequence number.",
          "maxLength" : 25
        },
        "RESPONSE_STATUS" : {
          "type" : "string",
          "description" : "Signifies status of the response [0:SUCCESS, 1:FAILURE]",
          "maxLength" : 1
        },
        "ERROR_CODE" : {
          "type" : "string",
          "description" : "Error Code",
          "enum" : [ "SI002:SI510|EIS APPLICATION INACTIVE", "SI569:BRANCH/TELLER MISSING", "SI570:BIT MAPPING NOT CONFIGURED", "SI014:SI500|EIS APPLICATION TIMEOUT", "SI011:SI520|INCORRECT DATA IN <TAG_NAME>", "SI011:SI520|MISSING FIELD <TAG_NAME>", "SI011:SI520|EXCESS FIELD PROVIDED <TAG_NAME>", "SI011:SI520|PARSING EXCEPTION", "SI001:SI530|INCORRECT REQUEST FORMATION", "SI001:SI530|DATA PROCESSING FAILED", "SI001:SI599|UNABLE TO PROCESS DUE TO TECHNICAL ERROR", "SI007:SI550|INTERNAL ERROR", "SI017:SI551|DB INTERNAL ERROR", "SI094:REFERENCE NUMBER NOT UNIQUE", "SI095:REFERENCE NUMBER NOT OF 25 CHAR", "SI096:REFERENCE NUMBER AND SOURCE ID MISMATCH", "SI097:REFERENCE NUMBER IS NOT OF FORMAT SBIXXX", "SI001:SI699|Any other unhandled exception received by EIS during service call with downstream", "<>002:<> will contain 2 character destination indicator followed by 002,indicates error being received from downstream application", "<>014:<> will contain 2 character destination indicator followed by 014.indicates timeout" ],
          "maxLength" : 5
        },
        "ERROR_DESCRIPTION" : {
          "type" : "string",
          "description" : "Error Description",
          "maxLength" : 100
        }
      },
      "required" : [ "REQUEST_REFERENCE_NUMBER", "ERROR_CODE", "RESPONSE_STATUS", "ERROR_DESCRIPTION" ]
    },
    "RequestDetails" : {
      "properties" : {
        "REQUEST_REFERENCE_NUMBER" : {
          "type" : "string",
          "description" : "Unique Request Reference Number should be of format SBIXXYYDDDHHmmssSSSNNNNNN First 3 alphabets will always be SBI, XX will signify Channel Identifier (eg: LT for YONO channel),YYDDD will signify the Julian Date (eg: 26-02-2020 will be represented as 20057),HHmmssSSS will signify the current time in hours, minutes, second and milisecond,NNNNNN will signify running sequence number.",
          "maxLength" : 25
        },
        "REQUEST" : {
          "description" : "Payload Encrypted Request",
          "type" : "string"
        },
        "DIGI_SIGN" : {
          "description" : "Digital signature",
          "type" : "string"
        }
      },
      "required" : [ "REQUEST_REFERENCE_NUMBER", "REQUEST", "DIGI_SIGN" ]
    },
    "PlainJSONRequest" : {
      "properties" : {
        "BRANCH_CODE" : {
          "description" : "Branch Code(Not required for BTH version)",
          "type" : "string",
          "maximum" : 5
        },
        "SOURCE_ID" : {
          "description" : "2 character AO identifier. For eg. YA for Yono App, YB for Yono Branch. This should be same as the 4th and 5th character taken together in the request reference number mentioned above.",
          "type" : "string",
          "maximum" : 2
        },
        "REQUEST_TELLER_ID" : {
          "description" : "Maker ID for the given transaction-Not required for Public API(Not required for TH and BTH version) ",
          "type" : "string",
          "maximum" : 7
        },
        "REQUEST_AUTH_ID" : {
          "type" : "string",
          "description" : "Request Auth ID(Checker ID)(Not required for TH and BTH version)",
          "maxLength" : 7
        },
        "FROM_ACCOUNT" : {
          "type" : "string",
          "description" : "From Account Number",
          "maxLength" : 17
        },
        "TRANSACTION_DATE" : {
          "type" : "string",
          "description" : "Transaction Date",
          "maxLength" : 8
        },
        "PROMO_NO" : {
          "type" : "string",
          "description" : "Promo Number",
          "maxLength" : 2
        },
        "TO_ACCOUNT" : {
          "type" : "string",
          "description" : "To Account Number",
          "maxLength" : 17
        },
        "NON_VALUE_DAYS" : {
          "type" : "string",
          "description" : "Non Value Days",
          "maxLength" : 2
        },
        "DEFERRED_INT_DAYS" : {
          "type" : "string",
          "description" : "Deferred Int Days",
          "maxLength" : 2
        },
        "CURRENCY" : {
          "type" : "string",
          "description" : "CURRENCY (INR)",
          "maxLength" : 3
        },
        "EXCHANGE_AMOUNT" : {
          "type" : "string",
          "description" : "Exchange Amount",
          "maxLength" : 17
        },
        "BASE_CURRENCY_AMOUNT" : {
          "type" : "string",
          "description" : "Base Currency Amount",
          "maxLength" : 17
        },
        "COMMISSION" : {
          "type" : "string",
          "description" : "COMMISSION",
          "maxLength" : 17
        },
        "CHANGE" : {
          "type" : "string",
          "description" : "Change",
          "maxLength" : 17
        },
        "RATE_TYPE" : {
          "type" : "string",
          "description" : "Rate Type",
          "maxLength" : 2
        },
        "TRACE_NUMBER" : {
          "type" : "string",
          "description" : "Trace Number",
          "maxLength" : 9
        },
        "STATEMENT_NARRATIVE" : {
          "type" : "string",
          "description" : "Statement Narrative",
          "maxLength" : 50
        },
        "PRE_MATURE_CLOSURE" : {
          "type" : "string",
          "description" : "Pre-Mature Closure (SCSS/MSSC)",
          "maxLength" : 1
        }
      },
      "required" : [ "BRANCH_CODE", "REQUEST_TELLER_ID", "REQUEST_AUTH_ID", "SOURCE_ID", "FROM_ACCOUNT", "TRANSACTION_DATE", "TO_ACCOUNT", "TRACE_NUMBER", "CURRENCY" ]
    },
    "ResponseDetails" : {
      "properties" : {
        "REQUEST_REFERENCE_NUMBER" : {
          "type" : "string",
          "description" : "Unique Request Reference Number should be of format SBIXXYYDDDHHmmssSSSNNNNNN First 3 alphabets will always be SBI, XX will signify Channel Identifier (eg: LT for YONO channel),YYDDD will signify the Julian Date (eg: 26-02-2020 will be represented as 20057),HHmmssSSS will signify the current time in hours, minutes, second and milisecond,NNNNNN will signify running sequence number.",
          "maxLength" : 25
        },
        "RESPONSE" : {
          "description" : "Payload Encrypted Response",
          "type" : "string"
        },
        "DIGI_SIGN" : {
          "description" : "Digital signature",
          "type" : "string"
        },
        "RESPONSE_DATE" : {
          "format" : "date",
          "type" : "string",
          "description" : "Response Date (dd-mm-yyyy HH:MM:SS)",
          "maxLength" : 19
        }
      },
      "required" : [ "REQUEST_REFERENCE_NUMBER", "RESPONSE", "RESPONSE_DATE" ]
    },
    "PlainJSONResponse" : {
      "properties" : {
        "JOURNAL_NUMBER" : {
          "type" : "string",
          "description" : "Journal number",
          "maxLength" : 9
        },
        "RESPONSE_STATUS" : {
          "type" : "string",
          "description" : "Describes the status of the response  0: For successful transactions 1: For unsuccessful transactions ",
          "maxLength" : 1
        },
        "ERROR_CODE" : {
          "type" : "string",
          "description" : "Error Code",
          "enum" : [ "SI002:SI510|EIS APPLICATION INACTIVE", "SI569:BRANCH/TELLER MISSING", "SI570:BIT MAPPING NOT CONFIGURED", "SI014:SI500|EIS APPLICATION TIMEOUT", "SI011:SI520|INCORRECT DATA IN <TAG_NAME>", "SI011:SI520|MISSING FIELD <TAG_NAME>", "SI011:SI520|EXCESS FIELD PROVIDED <TAG_NAME>", "SI011:SI520|PARSING EXCEPTION", "SI001:SI530|INCORRECT REQUEST FORMATION", "SI001:SI530|DATA PROCESSING FAILED", "SI001:SI599|UNABLE TO PROCESS DUE TO TECHNICAL ERROR", "SI007:SI550|INTERNAL ERROR", "SI017:SI551|DB INTERNAL ERROR", "SI094:REFERENCE NUMBER NOT UNIQUE", "SI095:REFERENCE NUMBER NOT OF 25 CHAR", "SI096:REFERENCE NUMBER AND SOURCE ID MISMATCH", "SI097:REFERENCE NUMBER IS NOT OF FORMAT SBIXXX", "SI001:SI699|Any other unhandled exception received by EIS during service call with downstream", "<>002:<> will contain 2 character destination indicator followed by 002,indicates error being received from downstream application", "<>014:<> will contain 2 character destination indicator followed by 014.indicates timeout" ],
          "maxLength" : 5
        },
        "ERROR_DESCRIPTION" : {
          "description" : "Error Description (in case of transaction failure)",
          "type" : "string",
          "maxLength" : 100
        }
      },
      "required" : [ "RESPONSE_STATUS", "ERROR_CODE", "ERROR_DESCRIPTION" ]
    }
  }
}`;

export const SwaggerEditor: React.FC = () => {
  const [content, setContent] = useState<string>(DEFAULT_SPEC);
  const [specObject, setSpecObject] = useState<OpenApiDocument>(() => {
    try {
      return (YAML.parse(DEFAULT_SPEC) as OpenApiDocument) || {};
    } catch {
      return {};
    }
  });
  const [diagnostics, setDiagnostics] = useState<DiagnosticIssue[]>([]);

  const editorRef = useRef<unknown>(null);
  const monacoRef = useRef<unknown>(null);
  const swaggerDomRef = useRef<HTMLDivElement | null>(null);

  // Sync Swagger UI instance
  useEffect(() => {
    if (!swaggerDomRef.current || !specObject || Object.keys(specObject).length === 0) return;

    swaggerDomRef.current.innerHTML = '';

    try {
      SwaggerUIBundle({
        domNode: swaggerDomRef.current,
        spec: specObject,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.SwaggerUIStandalonePreset
        ],
        layout: 'BaseLayout',
        deepLinking: false,
        displayRequestDuration: true,
        docExpansion: 'list',
        defaultModelsExpandDepth: 1
      });
    } catch (err) {
      console.error('Swagger UI render error:', err);
    }
  }, [specObject]);

  // Linting & Parsing logic
  const analyzeSpec = (value: string): { issues: DiagnosticIssue[]; parsed: OpenApiDocument | null } => {
    const issues: DiagnosticIssue[] = [];
    const doc = YAML.parseDocument(value, { prettyErrors: true });

    if (doc.errors.length > 0) {
      doc.errors.forEach((err) => {
        const linePos = err.linePos as [{ line: number; col: number }] | undefined;
        const line = linePos && linePos[0] ? linePos[0].line : 1;
        const col = linePos && linePos[0] ? linePos[0].col : 1;
        let suggestion = 'Check YAML syntax around this line.';

        const errStr = err.message.toLowerCase();
        if (errStr.includes('tab')) {
          suggestion = 'Tabs are forbidden in YAML. Replace tabs with 2 spaces.';
        } else if (errStr.includes('mapping')) {
          suggestion = 'Indentation error. Ensure keys share aligned indents.';
        } else if (errStr.includes('colon') || errStr.includes('expected')) {
          suggestion = "Ensure keys end with a colon and a space (e.g., 'key: value').";
        }

        issues.push({
          severity: 'Error',
          message: err.message.split('\n')[0] ?? 'YAML syntax error',
          line,
          col,
          suggestion
        });
      });
    } else {
      const parsed = doc.toJSON() as OpenApiDocument | null;
      if (!parsed || typeof parsed !== 'object') {
        issues.push({
          severity: 'Error',
          message: 'Spec must be a valid key-value mapping.',
          line: 1,
          col: 1,
          suggestion: 'Root structure must start with valid keys.'
        });
      } else {
        if (!parsed.openapi && !parsed.swagger) {
          issues.push({
            severity: 'Warning',
            message: "Missing 'openapi' or 'swagger' declaration.",
            line: 1,
            col: 1,
            suggestion: "Add 'swagger: \"2.0\"' or 'openapi: 3.0.3' at line 1."
          });
        }
        if (!parsed.info || !parsed.info.title || !parsed.info.version) {
          issues.push({
            severity: 'Warning',
            message: "Incomplete root 'info' configuration.",
            line: 2,
            col: 1,
            suggestion: "'info' section requires both 'title' and 'version'."
          });
        }
        if (!parsed.paths) {
          issues.push({
            severity: 'Warning',
            message: "Missing 'paths:' mapping.",
            line: 1,
            col: 1,
            suggestion: "Add a 'paths:' block describing operations."
          });
        }
      }
    }

    return { 
      issues, 
      parsed: doc.errors.length === 0 ? (doc.toJSON() as OpenApiDocument) : null 
    };
  };

  const syncMonacoMarkers = (issues: DiagnosticIssue[]) => {
    const monaco = monacoRef.current as {
      MarkerSeverity: { Error: number; Warning: number };
      editor: { setModelMarkers: (model: unknown, owner: string, markers: unknown[]) => void };
    } | null;
    const editor = editorRef.current as { getModel: () => unknown } | null;

    if (!monaco || !editor) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = issues.map((issue) => ({
      startLineNumber: issue.line,
      startColumn: issue.col,
      endLineNumber: issue.line,
      endColumn: issue.col + 15,
      message: `${issue.message} | Tip: ${issue.suggestion}`,
      severity: issue.severity === 'Error'
        ? monaco.MarkerSeverity.Error
        : monaco.MarkerSeverity.Warning
    }));

    monaco.editor.setModelMarkers(model, 'openapi-linter', markers);
  };

  const handleEditorChange = (val?: string) => {
    const text = val ?? '';
    setContent(text);

    const { issues, parsed } = analyzeSpec(text);
    setDiagnostics(issues);
    syncMonacoMarkers(issues);

    if (parsed) {
      setSpecObject(parsed);
    }
  };

  const handleEditorMount = (editorInstance: unknown, monacoInstance: unknown) => {
    editorRef.current = editorInstance;
    monacoRef.current = monacoInstance;
  };

  const handleBeautify = () => {
    try {
      const parsed = YAML.parse(content) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object') return;
      const formatted = YAML.stringify(parsed, { indent: 2 });
      setContent(formatted);

      const editor = editorRef.current as { setValue?: (val: string) => void } | null;
      if (editor?.setValue) {
        editor.setValue(formatted);
      }
      handleEditorChange(formatted);
    } catch {
      alert('Resolve YAML errors before formatting.');
    }
  };

  const handleDownloadJSON = () => {
    try {
      const parsed = YAML.parse(content) as OpenApiDocument;
      const jsonStr = JSON.stringify(parsed, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      const title = parsed?.info?.title ?? 'swagger-spec';
      anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Invalid structure cannot be serialized to JSON.');
    }
  };

  const handleDownloadPDF = () => {
    const targetElement = swaggerDomRef.current;
    if (!targetElement) return;

    const title = specObject?.info?.title ?? 'swagger-docs';
    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `${title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(targetElement).save();
  };

  return (
    <div className="flex flex-col flex-1 h-full w-full min-h-0 p-6 space-y-4 bg-[#030712] text-slate-200 overflow-hidden font-sans">
      {/* Top Banner Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
              Swagger Editor
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                LIVE LINTING
              </span>
            </h1>
            <p className="text-xs text-slate-400">Edit, format, validate, and preview OpenAPI/Swagger specifications in real-time.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBeautify}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#151E32] hover:bg-[#1E2B47] active:scale-95 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Beautify
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-[#151E32] hover:bg-[#1E2B47] active:scale-95 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
            JSON
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] active:scale-95 rounded-lg shadow-sm transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 w-full overflow-hidden">
        {/* Left Card: Monaco Editor & Error Panel */}
        <div className="flex flex-col h-full min-h-0 rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0F172A]/70 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Code2 className="w-4 h-4 text-teal-400" />
              SPECIFICATION (YAML / JSON)
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${diagnostics.length === 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {diagnostics.length === 0 ? 'VALID SPEC' : `${diagnostics.length} ISSUES`}
            </span>
          </div>

          <div className="flex-1 relative min-h-0 bg-[#090D16]">
            <Editor
              height="100%"
              defaultLanguage="yaml"
              value={content}
              onChange={handleEditorChange}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                tabSize: 2,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Diagnostic Console Panel */}
          {diagnostics.length > 0 && (
            <div className="max-h-40 overflow-y-auto bg-[#070B14] border-t border-slate-800 p-3 shrink-0">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-800/80 text-xs font-semibold text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Formatting Diagnostics ({diagnostics.length})
              </div>

              <div className="space-y-2">
                {diagnostics.map((diag, index) => (
                  <div key={index} className="text-xs font-mono bg-[#0F172A] p-2.5 rounded border border-slate-800">
                    <div className="flex items-start gap-2">
                      {diag.severity === 'Error' ? (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-slate-500 mr-2">[{diag.line}:{diag.col}]</span>
                        <span className={diag.severity === 'Error' ? 'text-rose-300 font-medium' : 'text-amber-200 font-medium'}>
                          {diag.message}
                        </span>
                        <div className="flex items-center gap-1 text-teal-400 mt-1 font-sans">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                          <span>{diag.suggestion}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Documentation Preview */}
        <div className="flex flex-col h-full min-h-0 rounded-xl bg-[#0B1120] border border-slate-800/80 shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#0F172A]/70 shrink-0">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE DOCUMENTATION PREVIEW
            </span>
          </div>

          {/* Swagger container with white surface wrapper inside the dark container */}
          <div className="flex-1 overflow-y-auto bg-white p-2">
            <div ref={swaggerDomRef} className="swagger-ui-container" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwaggerEditor;