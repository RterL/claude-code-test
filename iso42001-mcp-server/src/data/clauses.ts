import type { ClauseRequirement } from "../types.js";

/**
 * Clauses 4-10 of the AI management system (AIMS) requirements structure.
 * Each `summary` is an original paraphrase -- not the standard's exact
 * wording -- written from a licensed reading of ISO/IEC 42001:2023.
 */
export const CLAUSES: ClauseRequirement[] = [
  {
    id: "4.1",
    title: "Understanding the organization and its context",
    summary:
      "Identify the external and internal issues relevant to the AIMS's purpose, decide whether climate change is a relevant issue, and determine the organization's role(s) with respect to the AI systems it develops, provides, or uses (e.g. provider, producer, customer, partner).",
    level: "shall",
  },
  {
    id: "4.2",
    title: "Understanding the needs and expectations of interested parties",
    summary:
      "Identify the interested parties relevant to the AIMS, their requirements, and which of those requirements will be addressed through the AIMS.",
    level: "shall",
  },
  {
    id: "4.3",
    title: "Determining the scope of the AI management system",
    summary:
      "Define and document the boundaries and applicability of the AIMS, taking into account the context from 4.1 and the requirements from 4.2.",
    level: "shall",
  },
  {
    id: "4.4",
    title: "AI management system",
    summary:
      "Establish, implement, maintain, and continually improve an AIMS, including the processes needed and how they interact, in line with the standard's requirements.",
    level: "shall",
  },
  {
    id: "5.1",
    title: "Leadership and commitment",
    summary:
      "Top management demonstrates ownership of the AIMS: aligning the AI policy and objectives with strategy, integrating AIMS requirements into business processes, resourcing it, communicating its importance, ensuring it achieves intended results, and supporting continual improvement.",
    level: "shall",
  },
  {
    id: "5.2",
    title: "AI policy",
    summary:
      "Top management establishes an AI policy that fits the organization's purpose, frames how AI objectives are set, and commits to meeting applicable requirements and continual improvement; the policy is documented, communicated internally, and made available to interested parties as appropriate.",
    level: "shall",
  },
  {
    id: "5.3",
    title: "Roles, responsibilities and authorities",
    summary:
      "Top management assigns and communicates responsibilities and authorities for roles relevant to the AIMS, so accountability for AI-related outcomes is clear throughout the organization.",
    level: "shall",
  },
  {
    id: "6.1.1",
    title: "Actions to address risks and opportunities - General",
    summary:
      "Plan actions to address the risks and opportunities identified from the organization's context and interested-party requirements, aimed at assuring the AIMS achieves its results, preventing or reducing undesired effects, and pursuing continual improvement.",
    level: "shall",
  },
  {
    id: "6.1.2",
    title: "AI risk assessment",
    summary:
      "Define and run an AI risk assessment process that is aligned with the AI policy and objectives, produces consistent and comparable results, identifies risks, analyzes their potential consequences and likelihood, determines risk levels, and prioritizes risks for treatment.",
    level: "shall",
  },
  {
    id: "6.1.3",
    title: "AI risk treatment",
    summary:
      "Select risk treatment options and determine the controls needed to implement them, cross-checking against Annex A so nothing necessary is missed, considering Annex B implementation guidance, producing a Statement of Applicability with justification for included and excluded controls, and formulating a risk treatment plan approved by management.",
    level: "shall",
  },
  {
    id: "6.1.4",
    title: "AI system impact assessment",
    summary:
      "Define a process for assessing the potential consequences that developing, providing, or using an AI system can have on individuals, groups of individuals, and societies, considering the specific technical and societal context and applicable jurisdictions, and feed the results into risk assessment.",
    level: "shall",
  },
  {
    id: "6.2",
    title: "AI objectives and planning to achieve them",
    summary:
      "Establish AI objectives at relevant functions and levels that are consistent with the AI policy, measurable where practicable, monitored, communicated, and updated as needed; plan what will be done, resources required, responsibilities, timelines, and how results will be evaluated.",
    level: "shall",
  },
  {
    id: "6.3",
    title: "Planning of changes",
    summary:
      "Carry out changes to the AIMS in a planned manner rather than ad hoc.",
    level: "shall",
  },
  {
    id: "7.1",
    title: "Resources",
    summary:
      "Determine and provide the resources needed to establish, implement, maintain, and continually improve the AIMS.",
    level: "shall",
  },
  {
    id: "7.2",
    title: "Competence",
    summary:
      "Determine the competence needed by people whose work affects AI performance, ensure they are competent through education, training, or experience, take action to close gaps, evaluate whether that action worked, and retain evidence of competence.",
    level: "shall",
  },
  {
    id: "7.3",
    title: "Awareness",
    summary:
      "Ensure people working under the organization's control are aware of the AI policy, how they contribute to the AIMS's effectiveness, and the implications of not conforming to AIMS requirements.",
    level: "shall",
  },
  {
    id: "7.4",
    title: "Communication",
    summary:
      "Determine the internal and external communications relevant to the AIMS, including what, when, with whom, and how to communicate.",
    level: "shall",
  },
  {
    id: "7.5.1",
    title: "Documented information - General",
    summary:
      "Maintain the documented information required by the standard plus whatever else the organization determines necessary for the AIMS to be effective.",
    level: "shall",
  },
  {
    id: "7.5.2",
    title: "Creating and updating documented information",
    summary:
      "When creating or updating documented information, ensure appropriate identification and description, format, and review/approval for suitability and adequacy.",
    level: "shall",
  },
  {
    id: "7.5.3",
    title: "Control of documented information",
    summary:
      "Control documented information so it is available and suitable where and when needed and adequately protected, covering distribution/access, storage/preservation, version control, retention/disposition, and identification of externally-originated documents.",
    level: "shall",
  },
  {
    id: "8.1",
    title: "Operational planning and control",
    summary:
      "Plan, implement, and control the processes needed to meet AIMS requirements and carry out the actions from Clause 6 (including AI system development/usage life cycle controls), monitor their effectiveness, manage planned and unintended changes, and control externally provided processes, products, or services relevant to the AIMS.",
    level: "shall",
  },
  {
    id: "8.2",
    title: "AI risk assessment (operational)",
    summary:
      "Perform AI risk assessments at planned intervals or when significant changes are proposed or occur, and retain the results.",
    level: "shall",
  },
  {
    id: "8.3",
    title: "AI risk treatment (operational)",
    summary:
      "Implement the AI risk treatment plan and verify its effectiveness; run a new treatment process for newly identified risks, and revise the plan if a treatment proves ineffective.",
    level: "shall",
  },
  {
    id: "8.4",
    title: "AI system impact assessment (operational)",
    summary:
      "Perform AI system impact assessments at planned intervals or when significant changes are proposed or occur, and retain the results.",
    level: "shall",
  },
  {
    id: "9.1",
    title: "Monitoring, measurement, analysis and evaluation",
    summary:
      "Decide what needs to be monitored and measured, the methods to use, when to measure, and when to analyze and evaluate results; retain evidence and evaluate the AIMS's performance and effectiveness.",
    level: "shall",
  },
  {
    id: "9.2.1",
    title: "Internal audit - General",
    summary:
      "Conduct internal audits at planned intervals to check whether the AIMS conforms to the organization's own requirements and to the standard, and whether it is effectively implemented and maintained.",
    level: "shall",
  },
  {
    id: "9.2.2",
    title: "Internal audit programme",
    summary:
      "Plan, establish, implement, and maintain an audit programme considering the importance of the processes involved and prior audit results; define objectives, criteria, and scope per audit; select auditors to ensure objectivity and impartiality; report results to relevant managers; retain evidence.",
    level: "shall",
  },
  {
    id: "9.3.1",
    title: "Management review - General",
    summary:
      "Top management reviews the AIMS at planned intervals to ensure its continuing suitability, adequacy, and effectiveness.",
    level: "shall",
  },
  {
    id: "9.3.2",
    title: "Management review inputs",
    summary:
      "Feed the management review with the status of previous review actions, changes in internal/external issues and interested-party needs, AIMS performance trends (nonconformities and corrective actions, monitoring/measurement results, audit results), and improvement opportunities.",
    level: "shall",
  },
  {
    id: "9.3.3",
    title: "Management review results",
    summary:
      "Management review results include decisions on continual-improvement opportunities and any need for changes to the AIMS; retain evidence of the results.",
    level: "shall",
  },
  {
    id: "10.1",
    title: "Continual improvement",
    summary:
      "Continually improve the suitability, adequacy, and effectiveness of the AIMS.",
    level: "shall",
  },
  {
    id: "10.2",
    title: "Nonconformity and corrective action",
    summary:
      "When a nonconformity occurs, react to it and control/correct it, evaluate whether action is needed to eliminate its causes (reviewing the nonconformity, determining causes, checking for similar nonconformities), implement needed actions, review the effectiveness of corrective action, update the AIMS if necessary, and retain evidence of the nonconformity and the results of any corrective action.",
    level: "shall",
  },
];

export const CLAUSE_SECTIONS: Record<string, string> = {
  "4": "Context of the organization",
  "5": "Leadership",
  "6": "Planning",
  "7": "Support",
  "8": "Operation",
  "9": "Performance evaluation",
  "10": "Improvement",
};
