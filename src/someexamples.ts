import * as R from "ramda";
import "jasmine";

type SpyObj<T> = jasmine.SpyObj<T>;
type ToOptional<T> = {
    [P in keyof T]?: T[P];
};
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
// mapped types
type f<A, B> = (a: A) => B;
type source<T> = () => T;

// Test data
interface BigObject {
    key1: string;
    key2: string;
    key3: {
        childKey: string;
    };
}

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

    const assertNever: f<never, never> = (): never => {
        throw new Error();
    };

    const calculateArea: f<Shape, number> = (shape: Shape): number => {
        switch (shape) {
            case Shape.CIRCLE: return 1;
            case Shape.SQUARE: return 2;
            case Shape.RECTANGLE: return 3;
            default: return assertNever(shape);
        }
    };

    console.log(calculateArea(Shape.RECTANGLE));

    const badFun = (arg: boolean): number | void => {
        if (arg) {
            return 1;
        }
    };
    console.log(badFun(false));

    /*
      Thanks to Michael Lavrisha for this example
    */

    const spyObject: SpyObj<BigObject> = jasmine.createSpyObj("bigObject", ["getInventory"]);
    console.log(spyObject);


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
        //        "notRight",
    ];

    console.log(keyList);
};

export { someExamples };

// {
//     "compilerOptions": {
//         "outDir": "./dist/",
//         "sourceMap": true,
//         "module": "commonjs",
//         "target": "es5",
//         "jsx": "react",
//         "forceConsistentCasingInFileNames": true,
//         "noImplicitAny": true,
//         "noImplicitReturns": true,
//         "strict": true,
//         "noUnusedLocals": true,
//         "lib": [
// 	    "es2015",
// 	    "dom"
// 	],
// 	"typeRoots": [
// 	    "/node_modules/@types"
// 	],
// 	"types": [
//             "jasmine",
//             "node"
//         ]
//     },
//     "include": [
//         "src/**/*.ts",
//         "node_modules/@types"
//     ]
// }
