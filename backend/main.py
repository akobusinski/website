from fastapi_cache.backends.inmemory import InMemoryBackend
from dotenv import load_dotenv; load_dotenv()
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from fastapi_cache import FastAPICache
from fastapi import Request
import dynamic_router
import uvicorn.main
import logging
import fastapi

@asynccontextmanager
async def lifespan(app: fastapi.FastAPI):
    FastAPICache.init(InMemoryBackend()) # type: ignore   "Type of "x" is partially unknown" 🤓
    yield

app = fastapi.FastAPI(description="Backend", version="1.0.0", lifespan=lifespan)
router = dynamic_router.DynamicRouter()

router.logger.setLevel(logging.WARNING)
router.logger.addHandler(logging.StreamHandler())

router.scan("routes")
app.include_router(router.get_router())

@app.exception_handler(Exception)
async def exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"success": False, "message": "Internal server error"})

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080) # type: ignore   "Type of "x" is partially unknown" 🤓
