import * as R from "ramda";

// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html
// mapped types
type ToOptional<T> = {
    [P in keyof T]?: T[P];
};

// Generics and general aliasing
type f<A, B> = (a: A) => B;
type source<T> = () => T;
type sink<T> = (t: T) => void;

// Test data
// Nominal vs Structural
interface BigObject {
    key1: string;
    key2: string;
    key3: {
        childKey: string;
    };
}

type Child = {
    childKey: string;
};
type BigObjectAgain = {
    key1: string;
    key2: string;
    key3: Child;
};

type BiggerObject = {
    key1: string;
    key2: string;
    key3: {
        childKey: string;
    };
    extraKey: string;
}
// type BiggerObjectAgain = BigObject & { extraKey: string };

const whoCanGetIn: sink<BigObject> = (obj: BigObject) => {
    console.log("We did it!", obj)
}

// whoCanGetIn({
//     blah: "",
// });

whoCanGetIn({
    key1: "",
    key2: "",
    key3: {
        childKey: "something"
    }
});

const sameType: BigObject = {
    key1: "",
    key2: "",
    key3: {
        childKey: ""
    }
}
whoCanGetIn(sameType);

const otherType: BigObjectAgain = {
    key1: "",
    key2: "",
    key3: {
        childKey: ""
    }
}
whoCanGetIn(otherType);

const biggerObject: BiggerObject = {
    extraKey: "something",
    key1: "",
    key2: "",
    key3: {
        childKey: ""
    }
}
// const biggerObject: BiggerObjectAgain = {
//     extraKey: "something",
//     key1: "",
//     key2: "",
//     key3: {
//         childKey: ""
//     }
// }
whoCanGetIn(biggerObject);

// How to tell things apart with structural types? (discriminated unions) 

// type DataForShape = {
//     perimeter: number;
// }
// type RectangleData = DataForShape;
// type SquareData = DataForShape;
// type ChircleData = DataForShape;

// type ShapeData = RectangleData | SquareData | ChircleData;

// const areaFromShapeData: f<ShapeData, number> = (data: ShapeData): number => {
//     // no way to know if it is a circle, rectangle, or square
//     throw new Error("No way to tell the shapes apart");
// };

// console.log(areaFromShapeData({ perimeter: 10 }));


enum Species {
    SQUARE,
    CIRCLE,
    RECTANGLE,
}
type DataForShape<SPECIES extends Species> = {
    tag: SPECIES,
    perimeter: number;
}
type RectangleData = DataForShape<Species.RECTANGLE> & { ratio: number };
type SquareData = DataForShape<Species.SQUARE>;
type ChircleData = DataForShape<Species.CIRCLE>;

type ShapeData = RectangleData | SquareData | ChircleData;

const areaFromShapeData: f<ShapeData, number> = (data: ShapeData): number => {
    switch (data.tag) {
        case Species.CIRCLE: {
            const diameter = (data.perimeter / Math.PI);
            const radius = diameter / 2;
            return (Math.PI * radius) * radius;
        }
        case Species.RECTANGLE: {
            const halfPerimeter = data.perimeter / 2;
            const shortSide = halfPerimeter / (data.ratio + 1)
            const longSide = halfPerimeter - shortSide
            return shortSide * longSide;
        }
        case Species.SQUARE: {
            const sideLength = data.perimeter / 4;
            return sideLength * sideLength;
        }
    }
};

console.log(areaFromShapeData({ perimeter: 10, tag: Species.CIRCLE }));
console.log(areaFromShapeData({ perimeter: 8, tag: Species.SQUARE }));
console.log(areaFromShapeData({ perimeter: 6, tag: Species.RECTANGLE, ratio: 2 }));

const someExamples: source<void> = (): void => {
    /*
      These lines give a typescript error because the object literal does not match the type of BigObject
    */

    //    const myObj1: BigObject = { key1: "hi" };
    //    console.log(myObj1)

    const myObj2: Partial<BigObject> = { key1: "hi" };
    console.log(myObj2);

    const bigObjectFactory: (
        partial?: ToOptional<BigObject>
    ) => BigObject = (partial?: ToOptional<BigObject>): BigObject => {
        const defaultBigObject: BigObject = {
            key1: "value1",
            key2: "value2",
            key3: {
                childKey: "childValue"
            }
        };

        return Object.assign({}, defaultBigObject, partial);
    };

    const myObj: BigObject = bigObjectFactory();

    console.log(myObj);

    const bigObjectFactoryCleaner: f<ToOptional<BigObject>, BigObject> = (
        partial: ToOptional<BigObject>
    ): BigObject => {
        const defaultBigObject: BigObject = {
            key1: "value1",
            key2: "value2",
            key3: {
                childKey: "childValue"
            }
        };

        return R.merge(defaultBigObject, partial);
        // return {
        //     ...defaultBigObject,
        //     ...partial
        // };
        // return Object.assign({}, defaultBigObject, partial);
    };

    const result: BigObject = bigObjectFactory();
    console.log(result);

    const result2: BigObject = bigObjectFactoryCleaner({});
    console.log(result2);

    /*
      Exhaustive pattern matching
    */

    enum Shape {
        SQUARE,
        CIRCLE,
        RECTANGLE,
    }

    // works great if there is a return value
    const calculateArea: f<Shape, number> = (shape: Shape): number => {
        switch (shape) {
            case Shape.CIRCLE: return 1;
            case Shape.SQUARE: return 2;
            case Shape.RECTANGLE: return 3;
        }
    };

    // is possible even if there is no return value
    const assertNever = <T>(_n: never): T => {
        throw new Error();
    };
    const printAreaName: (shape: Shape) => void = (shape: Shape) => {
        switch (shape) {
            case Shape.CIRCLE:
                console.log("So round");
                break;
            case Shape.RECTANGLE:
                console.log("All the sides are not the same length");
                break;
            case Shape.SQUARE:
                console.log("Squary");
                break;
            default:
                assertNever(shape)
        }
    }

    console.log(calculateArea(Shape.RECTANGLE));
    console.log(printAreaName(Shape.SQUARE));

    const badFun: f<boolean, number | void> = (arg: boolean): number | void => {
        if (arg) {
            return 1;
        }
    };
    console.log(badFun(false));

    /*
      Thanks to TJ for this example
    */

    type ObjectType = {
        key1: string;
        key2: string;
        keyInfinity: string;
    };
    type UnionOfKeysType = keyof ObjectType;

    const keyList: UnionOfKeysType[] = [
        "key1",
        "key2",
        "keyInfinity",
        //    "notRight",
    ];

    console.log(keyList);
};

/*
When stuff goes wrong
*/

// type BigChildObject = {
//     a: BigObjectAgain;
//     b: {
//         a: BigObject;
//     }
// }
// type ReallyBigObject = {
//     child1: BigObject;
//     child2: BigObjectAgain;
//     child3: {
//         grandChild1: BiggerObject;
//         grandChild2: {
//             evenDeeper: BiggerObject;
//         }
//     },
//     child4: {
//         blah: BigObject;
//     },
//     child5: string;
//     child6: number;
//     child7: BigChildObject;
// };

// const factory: source<ReallyBigObject> = () => {
//     return {

//     }
// };

// console.log(factory());

/*
Typescript betrayal (https://effectivetypescript.com/2021/05/06/unsoundness/)
*/

type JustAMap = { [k: string]: string };
const betrayalMap: JustAMap = {
    key: "value"
};

const valueForKey = betrayalMap["key"];
const betrayed = betrayalMap["not_a_key"];
// noUncheckedIndexedAccess

// betrayed.toUpperCase();

console.log(valueForKey);
console.log(betrayed);

type LessBetrayed = Map<string, string>;
const lessBetrayed: LessBetrayed = new Map();
lessBetrayed.set("key", "value");

const fromMap = lessBetrayed.get("key");

// fromMap.toUpperCase()
console.log(fromMap);

type BaseType = {
    "key1": string;
    "key2": string;
};
type NotBetrayedAtAll = { [k in keyof BaseType]: string };
const notBetrayed: NotBetrayedAtAll = {
    "key1": "",
    "key2": "something"
}

const key1Value = notBetrayed["key1"];
// const notAKey = notBetrayed["notAKey"];

console.log(key1Value);

// Ultimate betrayal
const fromTheApi: unknown = {
    key: "value"
}

type APIResponseJSON = {
    keyFromApi: string
};
const ourAppThinksItIs: APIResponseJSON = fromTheApi as APIResponseJSON;
console.log(ourAppThinksItIs.keyFromApi);
console.log(ourAppThinksItIs.keyFromApi);

type SomeTypeThatWillBetrayUs = {
    key1: string;
    key2: string;
    key3: string;
    key4: string;
}

const instance: SomeTypeThatWillBetrayUs = {
    key1: "",
    key2: "",
    key3: "",
    key4: ""
}
const keys = Object.keys(instance);
// const keys = Object.keys(instance) as Array<keyof typeof instance>;

// keys.forEach((key) => {
//     const plucked = instance[key];
//     console.log(plucked);
// })


/*
Type guards (the rabbit hole has no bottom)
*/

const isKeyOf = <O extends object>(key: string | number | symbol, obj: O): key is keyof O => key in obj;

type MapType<T extends string> = { [key in T]: string };
const doStufWithAMap = <K extends string, T extends string>(maybeKey: K, map: MapType<T>): string | undefined => {
    if (maybeKey in map) {
        return map[maybeKey as unknown as T]; // eww gross, basically saying, ok typescript, let me take over here
    }

    return;
}

const doStufWithAMapTypeAssertion = <K extends string, T extends string>(maybeKey: K, map: MapType<T>): string | undefined => {
    if (isKeyOf(maybeKey, map)) {
        return map[maybeKey];
    }

    return;
}

console.log(keys);
console.log(doStufWithAMap);
console.log(doStufWithAMapTypeAssertion);

export { someExamples };
