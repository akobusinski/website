from fastapi_cache.backends.redis import RedisBackend
from dotenv import load_dotenv; load_dotenv()
from fastapi.responses import JSONResponse
from fastapi_cache import FastAPICache
from redis import asyncio as aioredis
from fastapi import Request
import dynamic_router
import uvicorn.main
import logging
import fastapi
import os

app = fastapi.FastAPI(description="Backend", version="1.0.0")
router = dynamic_router.DynamicRouter()

router.logger.setLevel(logging.WARNING)
router.logger.addHandler(logging.StreamHandler())

router.scan("routes")
app.include_router(router.get_router())

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"success": False, "message": "Internal server error"})

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url(os.getenv("REDIS_URL")) # type: ignore   "Type of "x" is partially unknown" 🤓
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache") # type: ignore   "Type of "x" is partially unknown" 🤓

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080) # type: ignore   "Type of "x" is partially unknown" 🤓
