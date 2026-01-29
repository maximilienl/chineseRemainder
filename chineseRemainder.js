/**
 * Solves a system of simultaneous congruences using the Chinese Remainder Theorem.
 * 
 * Given a system:
 *   x ≡ r₀ (mod m₀)
 *   x ≡ r₁ (mod m₁)
 *   ...
 *   x ≡ rₙ (mod mₙ)
 * 
 * Finds the unique solution x in [0, M) where M = m₀ × m₁ × ... × mₙ.
 * 
 * @param {bigint[]} remainders - The remainders [r₀, r₁, ..., rₙ].
 * @param {bigint[]} moduli - The moduli [m₀, m₁, ..., mₙ]. Must be pairwise coprime.
 * @returns {bigint} The smallest non-negative solution to the system.
 * @throws {Error} If arrays are empty, have different lengths, or moduli are not pairwise coprime.
 * 
 * @example
 * // x ≡ 2 (mod 3), x ≡ 3 (mod 5), x ≡ 2 (mod 7)
 * chineseRemainder([2n, 3n, 2n], [3n, 5n, 7n]);  // 23n
 * 
 * @example
 * // Décoder un message RSA avec CRT (optimisation)
 * const mp = modPow(c, dp, p);  // c^d mod p
 * const mq = modPow(c, dq, q);  // c^d mod q
 * const m = chineseRemainder([mp, mq], [p, q]);  // Combinaison
 */
function chineseRemainder(remainders, moduli) {
    // Validation
    if (!remainders.length || !moduli.length) {
        throw new Error("Arrays cannot be empty");
    }
    if (remainders.length !== moduli.length) {
        throw new Error("Arrays must have the same length");
    }
    
    const n = moduli.length;
    const prod = moduli.reduce((a, b) => a * b, 1n);
    
    let sum = 0n;
    for (let i = 0; i < n; i++) {
        const p = prod / moduli[i];
        const inv = modInverse(p, moduli[i]);  // Throws if not coprime
        sum += remainders[i] * inv * p;
    }
    
    return ((sum % prod) + prod) % prod;  // Ensure non-negative
}


/**
 * Computes the modular multiplicative inverse of `a` modulo `m`.
 * 
 * Finds x such that a·x ≡ 1 (mod m). Only exists if gcd(a, m) = 1.
 * 
 * @param {bigint} a - The number to find the inverse of.
 * @param {bigint} m - The modulus.
 * @returns {bigint} The modular inverse of `a` modulo `m`, in range [0, m).
 * @throws {Error} If a and m are not coprime (inverse doesn't exist).
 * 
 * @example
 * modInverse(3n, 11n);  // 4n (car 3×4 = 12 ≡ 1 mod 11)
 * modInverse(7n, 26n);  // 15n
 */
function modInverse(a, m) {
    const { gcd, x } = extendedGCD(a, m);
    if (gcd !== 1n) {
        throw new Error(`Modular inverse doesn't exist: gcd(${a}, ${m}) = ${gcd}`);
    }
    return ((x % m) + m) % m;
}
