
---

### 3. **Chinese Remainder Theorem (CRT)**

**Filename:** `chineseRemainder.js`

#### README

```markdown
# Chinese Remainder Theorem (CRT)

## Overview

The Chinese Remainder Theorem is a fundamental result in number theory that provides a method to solve systems of simultaneous congruences. Given several equations of the form:

\[
x \equiv r_1 \,(\text{mod } m_1), \, x \equiv r_2 \,(\text{mod } m_2), \, \ldots
\]

If the moduli \(m_1, m_2, \ldots\) are pairwise coprime, there exists a unique solution modulo the product of the moduli.

---

## How It Works

1. Compute the product of all moduli \(M = m_1 \cdot m_2 \cdot \ldots\).
2. For each modulus \(m_i\):
   - Compute \(M_i = M / m_i\).
   - Compute the modular inverse of \(M_i \mod m_i\).
   - Add \(r_i \cdot M_i \cdot \text{modInverse}(M_i, m_i)\) to the total.
3. Reduce the result modulo \(M\) to get the unique solution.

---

## Usage

### Function Signature
```javascript
function chineseRemainder(remainders, moduli) {
    // Implementation
}
