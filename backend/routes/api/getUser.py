from fastapi.responses import JSONResponse
from fastapi_cache.decorator import cache
from fastapi import Request
import aiohttp
import os

__METADATA__ = {
    "methods": ["GET"]
}

BASE_URL = "https://discord.com/api/v10"
USER_ID = os.getenv("DISCORD_ID")
TOKEN = os.getenv("DISCORD_TOKEN")

@cache(expire=3600) # An hour
async def handler(request: Request):
    async with aiohttp.ClientSession() as session:
        async with session.get(BASE_URL + f"/users/{USER_ID}", headers={
            "Authorization": f"Bot {TOKEN}"
        }) as resp:
            json = await resp.json()

    try: # little safety check if discord removes the field
        discrim = int(json["discriminator"])
    except Exception:
        discrim = 0

    return JSONResponse({
        "name": json["global_name"],
        "picture": f"https://cdn.discordapp.com/avatars/{json['id']}/{json['avatar']}",
        "handle": json["username"] if discrim == 0 else None,
        "tag": None if discrim == 0 else f"{json['username']}#{json['discriminator']}",
        "id": json["id"],
    })
