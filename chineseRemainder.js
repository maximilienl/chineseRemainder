/**
 * Solves a system of simultaneous congruences using the Chinese Remainder Theorem.
 * 
 * @param {bigint[]} remainders - The remainders in the system.
 * @param {bigint[]} moduli - The moduli in the system.
 * @returns {bigint} The smallest non-negative solution to the system of congruences.
 * 
 * @example
 * const remainders = [2n, 3n, 2n];
 * const moduli = [3n, 5n, 7n];
 * const result = chineseRemainder(remainders, moduli); // result = 23n
 */
function chineseRemainder(remainders, moduli) {
    const prod = moduli.reduce((a, b) => a * b, 1n);
    let sum = 0n;

    for (let i = 0; i < moduli.length; i++) {
        const p = prod / moduli[i];
        const inv = modInverse(p, moduli[i]);
        sum += remainders[i] * inv * p;
    }

    return sum % prod;
}

/**
 * Computes the modular multiplicative inverse of `a` modulo `m`.
 * 
 * @param {bigint} a - The number to find the inverse of.
 * @param {bigint} m - The modulus.
 * @returns {bigint} The modular inverse of `a` modulo `m`.
 */
function modInverse(a, m) {
    const { gcd, x } = extendedGCD(a, m);
    if (gcd !== 1n) throw new Error("No modular inverse exists");
    return (x % m + m) % m;
}
