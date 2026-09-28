// Dialog copy, ported from copyPages in the delivery package app.js
// Each entry: [kicker, heading, lead, ...['subheading|body']]
export const copyPages = {
  'privacy-architecture': ['PRIVATE STATE', 'Privacy architecture', 'Sensitive context stays protected as it moves across models, tools, counterparties, and venues.', 'Data minimization|Only the context needed for the task moves forward.', 'Confidential compute|Sensitive state is protected during coordination and execution.', 'Verifiable handoff|Prove requirements were met without exposing the underlying state.'],
  'security-architecture': ['SECURITY & EVIDENCE', 'Built for independent verification', 'Vishwa governs execution without taking custody of customer funds or private keys.', 'Documented controls|Architecture, permissions, decision records, and control scope are available for technical diligence.', 'Policy enforcement|The Gate evaluates institutional constraints before routing a request to approved execution systems.', 'Evidence and scope|Program participation is separate from customer relationships, security reviews, and certification claims.'],
  docs: ['DEVELOPER SURFACE', 'Build with the Gate', 'Connect an agent, declare its mandate, and route policy-enforced execution through approved systems. Interface availability is confirmed during technical scoping.', '1. Connect|Bring your agent and existing stack through an agreed API, SDK, CLI, or MCP integration.', '2. Declare the mandate|Define permissions, approved venues, spending limits, and approval requirements.', '3. Execute with proof|Receive an authorized or blocked policy result and an associated decision record.'],
  programs: ['PROGRAM SELECTIONS', 'Program participation', 'The supplied homepage identifies participation in these programs. Participation is not a security certification.', 'Anthropic|Selected for Anthropic’s Cyber Verification Program.', 'Plug and Play|Selected for a Plug and Play accelerator program. Fall 2026 cohort.', 'Evidence|Request the original announcement and program details from the team during diligence.'],
  'insights-library': ['INSIGHTS & WORKFLOWS', 'Governed agent infrastructure', 'Explore the questions behind institutional-grade agent execution across capital and compute.', 'Autonomous capital|What mandates, approvals, and settlement autonomous capital requires.', 'Enforcement first|Why policy enforcement belongs before execution, not after.', 'Governed workflows|How approval queues become governed, reconstructable workflows.'],
  'insight-0': ['PODCAST', 'What autonomous capital requires', 'A conversation on the controls institutions expect before agents can move capital.', 'Mandates|Every action maps to an explicit, enforceable mandate.', 'Settlement|Execution routes only through approved systems and venues.'],
  'insight-1': ['BLOG', 'Why enforcement belongs before execution', 'Reviewing an action after it happens is not the same as preventing an out-of-policy action.', 'Pre-execution|The Gate evaluates a request before capital or compute moves.', 'Evidence|Each decision produces a reconstructable record.'],
  'insight-2': ['WORKFLOW', 'From approval queues to governed workflows', 'Manual approval queues do not scale to autonomous execution.', 'Policy as code|Institutional constraints are enforced automatically.', 'Traceability|Each approved handoff can be followed end to end.'],
  'insight-3': ['RESEARCH', 'The control plane for financial agents', 'A governed runtime is the control plane between agent intent and approved execution.', 'Identity and authority|Who is acting, and under what authority.', 'Limits and approvals|What is permitted, and what requires approval.'],
  'privacy-notice': ['PRIVACY', 'Website privacy', 'This homepage is a demonstration. It does not collect analytics or personal data beyond what you choose to submit.', 'Contact requests|Details you send by email are used only to respond to your enquiry.', 'No tracking|The demonstration does not embed third-party tracking.'],
  terms: ['TERMS', 'Website demonstration', 'This homepage is a visual and interaction demonstration.', 'Illustrative information|GPU curves, requests, code responses, and execution records are examples and are not live market data or executed transactions.', 'Service access|Production service availability and applicable terms are agreed separately with the Vishwa team.'],
};

// GPU Index table sample data
export const gpuRows = [
  ['H100', 'Singapore', '90 days', 'Illustrative'],
  ['H100', 'US', 'On demand', 'Illustrative'],
  ['B200', 'EU', 'Reserved', 'Illustrative'],
  ['4090', 'Tokyo', 'On demand', 'Illustrative'],
];

// Example request shown at the end of the docs dialog
export const requestExample = {
  mandate: 'treasury_policy_v4',
  constraints: ['approved_venues', 'spend_limit'],
  intent: 'move_2.4M_USDC_to_treasury',
  agent: 'agt_7f2c',
  venue: 'existing_venue',
};
