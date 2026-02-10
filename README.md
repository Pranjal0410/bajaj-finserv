# BFHL REST API

REST API for Bajaj Finserv Health Limited Qualifier 1.

**Base URL:** `https://bajajfinserv-phi-navy.vercel.app`

## Endpoints

### GET /bfhl

```bash
curl https://bajajfinserv-phi-navy.vercel.app/bfhl
```

### POST /bfhl

#### Fibonacci

```bash
curl -X POST https://bajajfinserv-phi-navy.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 10}'
```

#### Prime

```bash
curl -X POST https://bajajfinserv-phi-navy.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [2, 3, 4, 5, 6, 7, 8, 9, 10]}'
```

#### LCM

```bash
curl -X POST https://bajajfinserv-phi-navy.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [4, 6, 12]}'
```

#### HCF

```bash
curl -X POST https://bajajfinserv-phi-navy.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [12, 18, 24]}'
```

#### AI

```bash
curl -X POST https://bajajfinserv-phi-navy.vercel.app/bfhl \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital of France?"}'
```

### GET /health

```bash
curl https://bajajfinserv-phi-navy.vercel.app/health
```
