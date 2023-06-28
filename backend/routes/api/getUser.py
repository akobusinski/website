from fastapi.responses import JSONResponse
from fastapi_cache.decorator import cache
from fastapi import Request
import aiohttp
import os

__METADATA__ = {
    "methods": ["GET"]
}

BASE_URL = "https://discord.com/api/v10"

@cache(expire=3600) # An hour
async def handler(request: Request):
    user_id = os.getenv("DISCORD_ID")
    token = os.getenv("DISCORD_TOKEN")
    async with aiohttp.ClientSession() as session:
        async with session.get(BASE_URL + f"/users/{user_id}", headers={
            "Authorization": f"Bot {token}"
        }) as resp:
            json = await resp.json()

    discrim = int(json["discriminator"])
    
    return JSONResponse({
        "name": json["global_name"],
        "picture": f"https://cdn.discordapp.com/avatars/{json['id']}/{json['avatar']}.webp",
        "handle": json["username"] if discrim == 0 else None,
        "tag": None if discrim == 0 else f"{json['username']}#{json['discriminator']}",
        "id": json["id"],
    })
