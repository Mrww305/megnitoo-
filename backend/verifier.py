"""
MegniToo Incubator: Deployment Verifier Implementation
Module: verifier.py
Async HTTP benchmark suite using httpx, tenacity exponential retries, and entropy checking.
"""

import asyncio
import time
from typing import Any, Dict, List, Optional
import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class DeploymentVerifier:
    def __init__(self, base_url: str, timeout: float = 6.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=5),
        retry=retry_if_exception_type((httpx.RequestError, httpx.TimeoutException))
    )
    async def check_health(self, health_path: str = "/healthz") -> Dict[str, Any]:
        """
        Pings root or /healthz endpoint. Confirms HTTP 200 OK and measures cold-start response time.
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            t0 = time.perf_counter()
            # Try health_path first, fallback to root
            try:
                resp = await client.get(f"{self.base_url}{health_path}")
            except httpx.HTTPStatusError:
                resp = await client.get(f"{self.base_url}/")
                
            elapsed_ms = int((time.perf_counter() - t0) * 1000)
            return {
                "http_status": resp.status_code,
                "healthy": resp.status_code == 200,
                "response_time_ms": elapsed_ms
            }

    async def test_contract(self, endpoint_path: str, sample_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sends sample JSON payload via POST and validates response status and structure.
        """
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            resp = await client.post(f"{self.base_url}{endpoint_path}", json=sample_payload)
            try:
                data = resp.json()
                valid_json = True
            except Exception:
                data = {"raw": resp.text}
                valid_json = False

            return {
                "status_code": resp.status_code,
                "schema_valid": resp.status_code in (200, 201) and valid_json,
                "response_body": data
            }

    async def benchmark_latency(
        self,
        endpoint_path: str,
        sample_payload: Dict[str, Any],
        samples: int = 50
    ) -> Dict[str, Any]:
        """
        Executes benchmark requests to compute p50 and p95 latency percentiles.
        Threshold: p95 must be under 800ms for production deployment.
        """
        latencies = []
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for _ in range(samples):
                t0 = time.perf_counter()
                try:
                    resp = await client.post(f"{self.base_url}{endpoint_path}", json=sample_payload)
                    if resp.status_code == 200:
                        latencies.append((time.perf_counter() - t0) * 1000)
                except Exception:
                    latencies.append(self.timeout * 1000)
                await asyncio.sleep(0.005)

        if not latencies:
            return {"passed": False, "p50_ms": 9999, "p95_ms": 9999, "samples": samples}

        latencies.sort()
        p50 = int(latencies[int(len(latencies) * 0.50)])
        p95 = int(latencies[int(len(latencies) * 0.95)])

        return {
            "samples": samples,
            "min_ms": int(min(latencies)),
            "p50_ms": p50,
            "p95_ms": p95,
            "max_ms": int(max(latencies)),
            "passed": p95 < 800
        }

    async def verify_model_sanity(self, endpoint_path: str) -> Dict[str, Any]:
        """
        Sends 5 semantically distinct test inputs to ensure the ML model
        produces non-trivial dynamic predictions rather than hardcoded mock outputs.
        """
        probe_inputs = [
            {"query": "What is reinforcement learning with human feedback?"},
            {"query": "Explain gradient checkpointing in deep transformer models."},
            {"query": "How do contrastive loss functions operate in latent space?"},
            {"query": "Define quantized INT8 matrix operations on GPUs."},
            {"query": "What are attention sink tokens in long-context LLMs?"}
        ]

        responses = []
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for probe in probe_inputs:
                try:
                    resp = await client.post(f"{self.base_url}{endpoint_path}", json=probe)
                    if resp.status_code == 200:
                        responses.append(resp.text)
                except Exception:
                    continue

        distinct_count = len(set(responses))
        variance_ratio = distinct_count / len(probe_inputs) if probe_inputs else 0
        non_trivial = distinct_count >= 4 and variance_ratio >= 0.8

        return {
            "tested_inputs": len(probe_inputs),
            "distinct_outputs": distinct_count,
            "non_trivial": non_trivial,
            "variance_score": round(variance_ratio, 3),
            "explanation": (
                "Dynamic non-trivial ML model output verified across varying prompts."
                if non_trivial else "Warning: Model returned uniform or hardcoded responses."
            )
        }
