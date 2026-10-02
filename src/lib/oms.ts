// OMS / backoffice status: the one place the site states it.
//
// The project is a client system in build. Until it goes live, no page may
// say it is in production. Every OMS status string on the site (home "What I
// do" and tile 02, the /projects entry and meta description, llms.txt) reads
// from this file, so going live is a one-line change: set OMS_LIVE_SINCE to
// the go-live month as 'MM.YYYY' and rebuild.
export const OMS_LIVE_SINCE: string | null = null;

export const omsLive = OMS_LIVE_SINCE !== null;

/** "in build since 09.2026", or "in production since MM.YYYY" once live. */
export const omsPhase = omsLive
  ? `in production since ${OMS_LIVE_SINCE}`
  : 'in build since 09.2026';

/** "client project, in build since 09.2026" */
export const omsStatus = `client project, ${omsPhase}`;

/** Scope verb, bare: "rebuilding" the legacy admin, or "replaced" once live. */
export const omsScopeVerb = omsLive ? 'replaced' : 'rebuilding';

/** Scope verb with a first-person subject: "I'm rebuilding" / "I replaced". */
export const omsScopeVerbFirstPerson = omsLive ? 'I replaced' : "I'm rebuilding";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
