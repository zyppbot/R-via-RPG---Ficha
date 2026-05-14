# Security Specification - Ruvia Character Sheet

## 1. Data Invariants
- A character MUST belong to the user who created it (`userId == request.auth.uid`).
- `hp` and `mp` should be numeric.
- Character names cannot exceed 100 characters.
- Users can only read and write their own characters.

## 2. The "Dirty Dozen" Payloads (Denial Tests)
1. **Identity Spoofing**: Create a character with `userId` of another user. (Target: `userId`)
2. **Access Violation**: Read another user's character sheet.
3. **Ghost Field Injection**: Add `isVerified: true` to the character document. (Target: Schema strictness)
4. **State Shortcutting**: Bypass character creation requirements.
5. **PII Leak**: Access user email via characters collection (if it were there).
6. **Self-Assigned Admin**: Try to set a `role: 'admin'` field.
7. **Resource Poisoning**: Inject 1MB string into character name.
8. **Orphaned Write**: Create a character without a valid `userId`.
9. **Update Gap**: Update `userId` of an existing character to take ownership.
10. **Denial of Wallet**: Infinite character creation (rules can't block this easily without quotas, but we check ID types).
11. **Immortal Field Violation**: Change `createdAt` on update.
12. **Temporal Integrity**: Use a client timestamp for `updatedAt`.

## 3. Test Runner
(Placeholder for actual test file if needed, but I will focus on implementing the rules that block these).
