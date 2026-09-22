import type { AnnexAControl } from "../types.js";

/**
 * Annex A reference controls. IDs, themes, and topics follow the standard's
 * structure; `summary` and `guidance` are original paraphrases written from
 * a licensed reading of ISO/IEC 42001:2023 Annex A and Annex B -- not a
 * reproduction of their normative text. Not all 38 controls will be
 * necessary for every organization: A.6.1's control treatment is itself a
 * risk-based decision (see 6.1.3), and exclusions belong in the Statement
 * of Applicability with a documented justification.
 */
export const CONTROLS: AnnexAControl[] = [
  {
    id: "A.2.2",
    theme: "A.2",
    themeTitle: "Policies related to AI",
    topic: "AI policy",
    summary:
      "Document a policy governing how the organization develops or uses AI systems.",
    guidance:
      "Ground the policy in business strategy, the organization's risk appetite, the level of risk its AI systems pose, legal/contractual obligations, and impact on interested parties. State principles for all AI-related activity and how deviations/exceptions are handled. Cross-reference topic-specific policies (e.g. data, security, model risk) rather than duplicating them.",
  },
  {
    id: "A.2.3",
    theme: "A.2",
    themeTitle: "Policies related to AI",
    topic: "Alignment with other organizational policies",
    summary:
      "Determine where existing organizational policies intersect with or are affected by AI-related objectives.",
    guidance:
      "AI intersects with quality, security, safety, and privacy policies. Review those policies for gaps or conflicts and either update them or add AI-specific provisions to the AI policy itself.",
  },
  {
    id: "A.2.4",
    theme: "A.2",
    themeTitle: "Policies related to AI",
    topic: "Review of the AI policy",
    summary:
      "Review the AI policy at planned intervals, or when changes warrant it, to keep it suitable, adequate, and effective.",
    guidance:
      "Assign an accountable role (or governing-body function) for reviewing and evolving the policy. Feed management-review outputs and changes in the regulatory/business/technical environment into the review.",
  },
  {
    id: "A.3.2",
    theme: "A.3",
    themeTitle: "Internal organization",
    topic: "AI roles and responsibilities",
    summary:
      "Define and allocate AI-related roles and responsibilities across the organization.",
    guidance:
      "Cover risk management, impact assessments, resource/asset management, security, safety, privacy, development, performance, human oversight, and supplier relationships. Prioritize based on identified risks and objectives, and define responsibilities at a level of detail people can actually act on.",
  },
  {
    id: "A.3.3",
    theme: "A.3",
    themeTitle: "Internal organization",
    topic: "Reporting of concerns",
    summary:
      "Provide a process for people to report concerns about the organization's AI-related activities.",
    guidance:
      "The mechanism should support confidential or anonymous reporting, be staffed by qualified people with the authority to investigate, protect reporters from retaliation, and respond within a reasonable timeframe. Existing whistleblowing/ethics channels can be reused rather than building a parallel one.",
  },
  {
    id: "A.4.2",
    theme: "A.4",
    themeTitle: "Resources for AI systems",
    topic: "Resource documentation",
    summary:
      "Identify and document the resources needed at each stage of an AI system's life cycle.",
    guidance:
      "Cover AI system components, data, tooling, compute/infrastructure, and people. This documentation (e.g. architecture or data-flow diagrams) feeds directly into impact assessments and helps surface resourcing gaps before they become delivery or risk problems.",
  },
  {
    id: "A.4.3",
    theme: "A.4",
    themeTitle: "Resources for AI systems",
    topic: "Data resources",
    summary: "Document the data resources used by the AI system.",
    guidance:
      "Track provenance, last-updated dates, data category (training/validation/test/production), labelling process, intended use, quality characteristics, retention/disposal rules, and known or suspected bias issues.",
  },
  {
    id: "A.4.4",
    theme: "A.4",
    themeTitle: "Resources for AI systems",
    topic: "Tooling resources",
    summary: "Document the tooling resources used to build or run the AI system.",
    guidance:
      "Include algorithm/model types, data-conditioning tools, optimization and evaluation methods, provisioning tooling, and the software/hardware used across design, development, and deployment.",
  },
  {
    id: "A.4.5",
    theme: "A.4",
    themeTitle: "Resources for AI systems",
    topic: "System and computing resources",
    summary: "Document the system and computing resources used by the AI system.",
    guidance:
      "Cover resource requirements (including constrained-device targets), deployment location (on-prem/cloud/edge), processing/network/storage resources, and the environmental or cost impact of the hardware used. Different life-cycle stages (development vs. operation) can need different resourcing.",
  },
  {
    id: "A.4.6",
    theme: "A.4",
    themeTitle: "Resources for AI systems",
    topic: "Human resources",
    summary:
      "Document the human resources and competencies involved across the AI system's life cycle, including decommissioning.",
    guidance:
      "Identify roles such as data scientists, human-oversight roles, safety/security/privacy experts, and domain specialists, and note where specific expertise (including relevant demographic representation for training data decisions) is required.",
  },
  {
    id: "A.5.2",
    theme: "A.5",
    themeTitle: "Assessing impacts of AI systems",
    topic: "AI system impact assessment process",
    summary:
      "Establish a process to assess the potential consequences of an AI system on individuals, groups, and societies.",
    guidance:
      "Define when an assessment is triggered (new system, materially changed system, high sensitivity/complexity/criticality), who performs it, and its steps: identification, analysis, evaluation, treatment, and documentation/communication of results. Vary rigor by domain (e.g. safety, privacy, security) as appropriate.",
  },
  {
    id: "A.5.3",
    theme: "A.5",
    themeTitle: "Assessing impacts of AI systems",
    topic: "Documentation of AI system impact assessments",
    summary:
      "Document the results of impact assessments and retain them for a defined period.",
    guidance:
      "Record intended use and reasonably foreseeable misuse, positive and negative impacts, predictable failure modes and mitigations, affected demographic groups, system complexity, human-oversight arrangements, and workforce/employment effects. Set retention periods from legal requirements or internal policy.",
  },
  {
    id: "A.5.4",
    theme: "A.5",
    themeTitle: "Assessing impacts of AI systems",
    topic: "Assessing AI system impact on individuals or groups of individuals",
    summary:
      "Assess and document the AI system's potential impact on individuals or groups throughout its life cycle.",
    guidance:
      "Consider fairness, accountability, transparency/explainability, security and privacy, safety and health, financial consequences, accessibility, and human rights. Give particular attention to groups needing specific protection (children, elderly, impaired persons, workers).",
  },
  {
    id: "A.5.5",
    theme: "A.5",
    themeTitle: "Assessing impacts of AI systems",
    topic: "Assessing societal impacts of AI systems",
    summary: "Assess and document the AI system's potential societal impacts.",
    guidance:
      "Consider environmental sustainability, economic effects, effects on government/democratic processes, health and safety at population scale, and cultural/normative effects (including misinformation risk). Weigh both beneficial and harmful potential uses.",
  },
  {
    id: "A.6.1.2",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "Objectives for responsible development of AI system",
    summary:
      "Identify and document objectives that guide responsible AI system development, and build them into the development life cycle.",
    guidance:
      "If an objective like fairness is adopted, translate it into concrete requirements at each stage (data acquisition, conditioning, model training, verification/validation) -- e.g. specific testing methods for unwanted bias -- rather than leaving it as an aspiration.",
  },
  {
    id: "A.6.1.3",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "Processes for responsible AI system design and development",
    summary:
      "Define and document the specific processes used for responsible design and development of the AI system.",
    guidance:
      "Address life-cycle stages, testing requirements, human-oversight processes and tooling, when impact assessments occur, training-data rules, required expertise/training for developers, release criteria, approval/sign-off gates, change control, usability/controllability, and interested-party engagement.",
  },
  {
    id: "A.6.2.2",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system requirements and specification",
    summary:
      "Specify and document requirements for new AI systems or material enhancements to existing ones.",
    guidance:
      "Document the rationale for building the system (business case, customer request, regulatory driver), how the model will be trained, and data requirements. Revisit requirements when the system proves unable to operate as intended or new information changes the calculus (including financial feasibility).",
  },
  {
    id: "A.6.2.3",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "Documentation of AI system design and development",
    summary:
      "Document the AI system's design and development based on objectives, requirements, and specification criteria.",
    guidance:
      "Capture the ML approach, learning algorithm/model type, training data quality plan, evaluation/refinement approach, hardware/software components, AI-specific security threats considered (e.g. data poisoning, model theft, model inversion), interface/output presentation, human interaction design, and interoperability/portability considerations. Maintain a final architecture record even after iterative design changes.",
  },
  {
    id: "A.6.2.4",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system verification and validation",
    summary:
      "Define and document verification and validation measures for the AI system and the criteria for using them.",
    guidance:
      "Cover testing methodologies/tools, selection and representativeness of test data, and release-criteria requirements, including a plan to evaluate risk to individuals, groups, and societies as part of validation.",
  },
  {
    id: "A.6.2.5",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system deployment",
    summary:
      "Document a deployment plan and confirm appropriate requirements are met before deployment.",
    guidance:
      "Confirm verification/validation criteria were met, required approvals/sign-offs were obtained, rollback or contingency plans exist, and that operational monitoring is ready to activate at go-live.",
  },
  {
    id: "A.6.2.6",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system operation and monitoring",
    summary:
      "Define the elements needed for the AI system's ongoing operation, at minimum covering system/performance monitoring, repairs, updates, and support.",
    guidance:
      "Set thresholds for performance/drift monitoring, an incident-response path when thresholds are breached, and a cadence for applying updates or retraining, with clear ownership for each.",
  },
  {
    id: "A.6.2.7",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system technical documentation",
    summary:
      "Determine what technical documentation each relevant category of interested party (users, partners, supervisory authorities, etc.) needs, and provide it in an appropriate form.",
    guidance:
      "Tailor depth and format to the audience -- a regulator's documentation needs differ from an end user's -- and keep it current as the system changes.",
  },
  {
    id: "A.6.2.8",
    theme: "A.6",
    themeTitle: "AI system life cycle",
    topic: "AI system recording of event logs",
    summary:
      "Determine at which life-cycle phases event logging should be enabled, with logging active at minimum while the system is in use.",
    guidance:
      "Define what events are logged (inputs/outputs, decisions, overrides, errors), retention periods, and how logs support incident investigation, audit, and monitoring.",
  },
  {
    id: "A.7.2",
    theme: "A.7",
    themeTitle: "Data for AI systems",
    topic: "Data for development and enhancement of AI system",
    summary:
      "Define, document, and implement data management processes for developing AI systems.",
    guidance:
      "Cover the full data lifecycle used for development: sourcing, storage, access control, versioning, and how enhancement/retraining data is managed over time.",
  },
  {
    id: "A.7.3",
    theme: "A.7",
    themeTitle: "Data for AI systems",
    topic: "Acquisition of data",
    summary:
      "Determine and document how data used in AI systems is acquired and selected.",
    guidance:
      "Record the source, selection criteria, licensing/consent basis, and any known limitations of acquired datasets before they enter the pipeline.",
  },
  {
    id: "A.7.4",
    theme: "A.7",
    themeTitle: "Data for AI systems",
    topic: "Quality of data for AI systems",
    summary:
      "Define and document data-quality requirements, and confirm data used to develop and operate the AI system meets them.",
    guidance:
      "Specify measurable quality characteristics (accuracy, completeness, consistency, timeliness, representativeness) relevant to the system's purpose, and verify data against them before use.",
  },
  {
    id: "A.7.5",
    theme: "A.7",
    themeTitle: "Data for AI systems",
    topic: "Data provenance",
    summary:
      "Define and document a process for recording the provenance of data used across the data and AI system life cycles.",
    guidance:
      "Track where each dataset came from, how it was transformed, and by whom, so lineage can be reconstructed for audits, incident investigation, or bias analysis.",
  },
  {
    id: "A.7.6",
    theme: "A.7",
    themeTitle: "Data for AI systems",
    topic: "Data preparation",
    summary:
      "Define and document the criteria for selecting data-preparation methods and the methods used.",
    guidance:
      "Document cleaning, labelling, transformation, and augmentation steps applied before training/use, and the rationale for choosing them, so preparation choices are reproducible and reviewable.",
  },
  {
    id: "A.8.2",
    theme: "A.8",
    themeTitle: "Information for interested parties of AI systems",
    topic: "System documentation and information for users",
    summary:
      "Determine and provide the information users of the AI system need.",
    guidance:
      "Give users enough information to understand the system's purpose, capabilities, limitations, and appropriate use -- not just a technical spec sheet.",
  },
  {
    id: "A.8.3",
    theme: "A.8",
    themeTitle: "Information for interested parties of AI systems",
    topic: "External reporting",
    summary:
      "Provide a way for interested parties to report adverse impacts of the AI system.",
    guidance:
      "Publish an accessible channel (contact point, form) for external reporting of harms or concerns, distinct from internal whistleblowing, and define how those reports get triaged.",
  },
  {
    id: "A.8.4",
    theme: "A.8",
    themeTitle: "Information for interested parties of AI systems",
    topic: "Communication of incidents",
    summary:
      "Determine and document a plan for communicating incidents to users of the AI system.",
    guidance:
      "Define incident severity tiers, who gets notified at each tier, timeframes, and the channel used, consistent with any regulatory incident-reporting obligations.",
  },
  {
    id: "A.8.5",
    theme: "A.8",
    themeTitle: "Information for interested parties of AI systems",
    topic: "Information for interested parties",
    summary:
      "Determine and document the organization's obligations to report AI system information to interested parties.",
    guidance:
      "Map which interested parties (regulators, customers, partners, the public) are owed what information, on what cadence, and under which legal or contractual basis.",
  },
  {
    id: "A.9.2",
    theme: "A.9",
    themeTitle: "Use of AI systems",
    topic: "Processes for responsible use of AI systems",
    summary: "Define and document the processes for responsible use of AI systems.",
    guidance:
      "Cover acceptable-use rules, required training before use, escalation paths for misuse or unexpected behavior, and how usage is monitored against the intended purpose.",
  },
  {
    id: "A.9.3",
    theme: "A.9",
    themeTitle: "Use of AI systems",
    topic: "Objectives for responsible use of AI system",
    summary:
      "Identify and document objectives to guide the responsible use of AI systems.",
    guidance:
      "Set objectives (e.g. avoiding automation bias, maintaining human oversight, respecting data-subject rights) and build them into user guidance and monitoring rather than leaving them implicit.",
  },
  {
    id: "A.9.4",
    theme: "A.9",
    themeTitle: "Use of AI systems",
    topic: "Intended use of the AI system",
    summary:
      "Ensure the AI system is used in line with its intended uses and accompanying documentation.",
    guidance:
      "Actively monitor for use outside the documented intended purpose (scope creep, repurposing) and have a defined response when it's detected.",
  },
  {
    id: "A.10.2",
    theme: "A.10",
    themeTitle: "Third-party and customer relationships",
    topic: "Allocating responsibilities",
    summary:
      "Ensure responsibilities are allocated across the organization, its partners, suppliers, customers, and other third parties throughout the AI system life cycle.",
    guidance:
      "Make responsibility allocation explicit in contracts or agreements wherever an external party touches the life cycle, so no stage of the life cycle is left without an accountable owner.",
  },
  {
    id: "A.10.3",
    theme: "A.10",
    themeTitle: "Third-party and customer relationships",
    topic: "Suppliers",
    summary:
      "Ensure that services, products, or materials provided by suppliers align with the organization's approach to responsible AI development and use.",
    guidance:
      "Extend supplier due-diligence/onboarding to cover AI-specific risk (data sourcing, model provenance, security practices) and require suppliers to meet the organization's AI policy expectations where relevant.",
  },
  {
    id: "A.10.4",
    theme: "A.10",
    themeTitle: "Third-party and customer relationships",
    topic: "Customers",
    summary:
      "Ensure the organization's responsible-AI approach considers customer expectations and needs.",
    guidance:
      "Build customer-facing commitments (transparency, support channels, incident communication) into the responsible-AI approach, not just internal controls.",
  },
];

export const CONTROL_THEMES: Record<string, string> = {
  "A.2": "Policies related to AI",
  "A.3": "Internal organization",
  "A.4": "Resources for AI systems",
  "A.5": "Assessing impacts of AI systems",
  "A.6": "AI system life cycle",
  "A.7": "Data for AI systems",
  "A.8": "Information for interested parties of AI systems",
  "A.9": "Use of AI systems",
  "A.10": "Third-party and customer relationships",
};
