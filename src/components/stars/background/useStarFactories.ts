import { useEffect, useRef } from "react";
import { intoFactory, intoNumberFactory } from "../utils";
import { BackgroundStarsProps } from "./background";

export type Factories = ReturnType<typeof useStarFactories>;

export const useStarFactories = (props: Required<Pick<BackgroundStarsProps, 'scale' | 'rotation' | 'ttl' | 'preAge' | 'color'>>) => {
    const { scale, rotation, ttl, preAge, color } = props;

    const scaleFactory    = useRef(intoNumberFactory(scale));
    const rotationFactory = useRef(intoNumberFactory(rotation));
    const ttlFactory      = useRef(intoNumberFactory(ttl));
    const preAgeFactory   = useRef(intoNumberFactory(preAge));
    const colorFactory    = useRef(intoFactory(color));

    // it really doesnt matter if it runs after or before the render, since everything is done via useFrame which runs outside of the render loop
    useEffect(() => { scaleFactory.current    = intoNumberFactory(scale)    }, [scale]);
    useEffect(() => { rotationFactory.current = intoNumberFactory(rotation) }, [rotation]);
    useEffect(() => { ttlFactory.current      = intoNumberFactory(ttl)      }, [ttl]);
    useEffect(() => { preAgeFactory.current   = intoNumberFactory(preAge)   }, [preAge]);
    useEffect(() => { colorFactory.current    = intoFactory(color)          }, [color]);

    return {
        scaleFactory,
        rotationFactory,
        ttlFactory,
        preAgeFactory,
        colorFactory,
    }
}
