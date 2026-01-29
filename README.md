# Théorème des Restes Chinois (CRT)

## Qu'est-ce que c'est ?

Le théorème des restes chinois résout un système de congruences simultanées :

```
x ≡ 2 (mod 3)
x ≡ 3 (mod 5)
x ≡ 2 (mod 7)
```

→ Solution : `x = 23` (et toute valeur 23 + k×105)

```javascript
chineseRemainder([2n, 3n, 2n], [3n, 5n, 7n])  // 23n
```

---

## Pourquoi c'est utile ?

### 1. Optimisation RSA (CRT-RSA)

Le déchiffrement RSA standard calcule `m = c^d mod n`. Avec le CRT, on calcule séparément mod `p` et mod `q`, puis on combine — **4× plus rapide** :

```javascript
// RSA standard (lent)
const m = modPow(c, d, n);

// RSA avec CRT (rapide)
const dp = d % (p - 1n);
const dq = d % (q - 1n);
const mp = modPow(c, dp, p);  // Plus petit exposant
const mq = modPow(c, dq, q);  // Plus petit modulus
const m = chineseRemainder([mp, mq], [p, q]);  // Combinaison
```

### 2. Calcul distribué

Effectuer des calculs sur de grands nombres en travaillant sur plusieurs petits moduli indépendamment, puis recombiner.

```javascript
// Calculer 123456789^1000 mod (3 × 5 × 7 × 11 × 13)
// Au lieu d'un seul gros calcul, on fait 5 petits :
const r3  = modPow(123456789n, 1000n, 3n);
const r5  = modPow(123456789n, 1000n, 5n);
const r7  = modPow(123456789n, 1000n, 7n);
const r11 = modPow(123456789n, 1000n, 11n);
const r13 = modPow(123456789n, 1000n, 13n);

const result = chineseRemainder(
    [r3, r5, r7, r11, r13],
    [3n, 5n, 7n, 11n, 13n]
);
```

### 3. Cryptographie à seuil

Schémas de partage de secret (Shamir, etc.).

### 4. Codes correcteurs d'erreurs

Reed-Solomon et autres codes basés sur l'arithmétique modulaire.

---

## Comment ça marche ?

### Condition préalable

Les moduli doivent être **premiers entre eux deux à deux** :
- `gcd(m₀, m₁) = 1`
- `gcd(m₀, m₂) = 1`
- `gcd(m₁, m₂) = 1`
- etc.

### Construction de la solution

Pour le système `x ≡ rᵢ (mod mᵢ)` :

1. Calculer `M = m₀ × m₁ × ... × mₙ`
2. Pour chaque `i`, calculer `Mᵢ = M / mᵢ`
3. Trouver `yᵢ` tel que `Mᵢ × yᵢ ≡ 1 (mod mᵢ)` (inverse modulaire)
4. La solution est : `x = Σ(rᵢ × Mᵢ × yᵢ) mod M`

### Exemple détaillé

```
x ≡ 2 (mod 3)
x ≡ 3 (mod 5)
x ≡ 2 (mod 7)

M = 3 × 5 × 7 = 105

Pour i=0 (mod 3):
  M₀ = 105/3 = 35
  y₀ = inverse(35, 3) = inverse(2, 3) = 2  (car 2×2=4≡1 mod 3)
  Terme: 2 × 35 × 2 = 140

Pour i=1 (mod 5):
  M₁ = 105/5 = 21
  y₁ = inverse(21, 5) = inverse(1, 5) = 1
  Terme: 3 × 21 × 1 = 63

Pour i=2 (mod 7):
  M₂ = 105/7 = 15
  y₂ = inverse(15, 7) = inverse(1, 7) = 1
  Terme: 2 × 15 × 1 = 30

x = (140 + 63 + 30) mod 105 = 233 mod 105 = 23
```

Vérification :
- 23 mod 3 = 2 ✓
- 23 mod 5 = 3 ✓
- 23 mod 7 = 2 ✓

---

## Utilisation

```javascript
// Système simple
const x = chineseRemainder([2n, 3n], [5n, 7n]);
// x ≡ 2 (mod 5) et x ≡ 3 (mod 7)
console.log(x);  // 17n

// Vérification
console.log(17n % 5n);  // 2n ✓
console.log(17n % 7n);  // 3n ✓
```

### Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `remainders` | `bigint[]` | Les restes [r₀, r₁, ...] |
| `moduli` | `bigint[]` | Les moduli [m₀, m₁, ...], doivent être copremiers deux à deux |

### Retour

`bigint` : La plus petite solution non-négative dans `[0, m₀×m₁×...×mₙ)`

### Erreurs

| Cas | Erreur |
|-----|--------|
| Arrays vides | `"Arrays cannot be empty"` |
| Tailles différentes | `"Arrays must have the same length"` |
| Moduli non copremiers | `"Modular inverse doesn't exist"` |

---

## Complexité

| Aspect | Valeur |
|--------|--------|
| Temps | O(n × log²(M)) où n = nombre de congruences |
| Espace | O(1) auxiliaire |

Le coût est dominé par les calculs d'inverse modulaire (extendedGCD).

---

## Unicité de la solution

Le CRT garantit une **unique** solution dans `[0, M)` où `M = ∏mᵢ`.

Toutes les solutions sont de la forme : `x₀ + k×M` pour `k ∈ ℤ`

---

## Exemple concret : CRT-RSA

```javascript
// Paramètres RSA
const p = 61n;
const q = 53n;
const n = p * q;  // 3233
const e = 17n;
const d = 2753n;

// Message chiffré
const c = 2790n;

// Déchiffrement standard
const m_standard = modPow(c, d, n);

// Déchiffrement CRT (plus rapide)
const dp = d % (p - 1n);  // 53
const dq = d % (q - 1n);  // 49
const mp = modPow(c, dp, p);  // c^dp mod p
const mq = modPow(c, dq, q);  // c^dq mod q
const m_crt = chineseRemainder([mp, mq], [p, q]);

console.log(m_standard);  // 65n
console.log(m_crt);       // 65n ✓ (même résultat, plus rapide)
```

---

## Origine historique

Le théorème tire son nom du mathématicien chinois Sun Zi (孫子) qui, au IIIe siècle, posa le problème suivant :

> "Il y a un nombre inconnu. Divisé par 3, le reste est 2. Divisé par 5, le reste est 3. Divisé par 7, le reste est 2. Quel est ce nombre ?"

Réponse : 23 (ou 128, 233, ...)

---

## Dépendances

Cette implémentation nécessite :
- `extendedGCD(a, b)` - Algorithme d'Euclide étendu

---

## Références

- [Wikipedia - Chinese remainder theorem](https://en.wikipedia.org/wiki/Chinese_remainder_theorem)
- Sun Zi Suanjing (孫子算經), IIIe siècle
- Gauss, C.F. "Disquisitiones Arithmeticae" (1801), Articles 32-36
