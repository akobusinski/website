from typing import List, Dict, Any, Callable, Optional
from fastapi.routing import APIRouter
import pathlib
import logging
import imp
import os

class DynamicRouter:
    def __init__(self):
        self.routers: List[APIRouter] = []
        self.logger = logging.getLogger("DynamicRouter")
    
    def scan(self, directory: str):
        directory = directory.removeprefix("./")
        for root, _, filenames in os.walk(directory, followlinks=True):
            clean_root = root.replace("\\", "/").removeprefix("./").removeprefix(f"{directory}")

            filenames = [i for i in filenames if i.endswith(".py")]
            if not filenames: continue

            router = APIRouter(prefix=clean_root)

            for filename in filenames:
                self.logger.debug(f"Loading {clean_root}/{filename.removesuffix('.py')}..")

                try:
                    module_path = pathlib.Path(root, filename).resolve()
                except Exception:
                    self.logger.exception(f"Failed to load {directory}/{clean_root}/{filename}")
                    continue

                module = imp.load_source(filename, str(module_path))

                KWARGS: Dict[Any, Any] = getattr(module, "__METADATA__", {})

                handler: Optional[Callable[..., Any]] = getattr(module, "handler", None)
                if not handler:
                    self.logger.error(f"{directory}{clean_root}/{filename} does not have a handler function!")
                    continue
                
                clean_name = filename.removesuffix('.py')
                if clean_name == "__index__":
                    clean_name = "" 

                router.add_api_route(
                    **KWARGS,
                    path=f"/{clean_name}",
                    endpoint=handler
                )
            
            self.routers.append(router)
    
    def get_router(self):
        global_router = APIRouter()
        
        for router in self.routers:
            global_router.include_router(router)
        
        return global_router
