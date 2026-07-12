/** Parsed ACDSDATA section (R2013+ binary ASM payloads linked to entities). */
export interface AcdsDataSection {
  /** ASM_Data payloads keyed by owner entity handle (uppercase, trimmed). */
  byOwnerHandle: Record<string, Uint8Array>
}
