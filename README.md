This repo contains a very simple react application and typescript examples in someexamples.ts.

## Typescript compiler (tsconfig.json)
There are some compiler options enabled in tsconfig.json that are not enabled in Angular applications by default (at least as of 5.x).  The extra flags are `noImplicitReturns`, `noUnusedLocals`, `strict`, and `noImplicitAny`.  In particular, `noImplicitReturns` is a really nice flag, it will complain if a function has a return type specified but there are branches without a return value.


## Typescript linter (tslint.json)
The linter is turned up pretty high, the `typedef` entry in particular requires type declarations in a variety of places.  For this example, almost all of the options have been enabled.

## Typescript examples (src/someexamples.ts)
The examples include a pattern for making object factories which allow developers to fully specify an object, but in tests, override only the default values they care about.

There are also a couple of type aliases.  Type aliases can also be leveraged to reduce some of the verbosity of declaring all the Typescript types.

The final example is about exhaustive pattern matching which can be very nice to have the type system keep track of.

I will happily add any patterns and examples which have been useful for different teams if someone can send them my way.
