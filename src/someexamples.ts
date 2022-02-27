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
type BiggerObjectAgain = BigObject & { extraKey: string };

const whoCanGetIn: sink<BigObject> = (_obj: BigObject) => {
    console.log("We did it!")
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
    const assertNever = <T>(n: never): T => {
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

type BigChildObject = {
    a: BigObjectAgain;
    b: {
        a: BigObject;
    }
}
type ReallyBigObject = {
    child1: BigObject;
    child2: BigObjectAgain;
    child3: {
        grandChild1: BiggerObject;
        grandChild2: {
            evenDeeper: BiggerObject;
        }
    },
    child4: {
        blah: BigObject;
    },
    child5: string;
    child6: number;
    child7: BigChildObject;
};

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

betrayed.toUpperCase();

console.log(valueForKey);
console.log(betrayed);

type LessBetrayed = Map<string, string>;
const lessBetrayed: LessBetrayed = new Map();
lessBetrayed.set("key", "value");

const fromMap = lessBetrayed.get("key");

// fromMap.toUpperCase()

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

export { someExamples };
