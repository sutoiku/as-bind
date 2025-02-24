# as-bind

<!-- Badges -->

[![Build Status](https://travis-ci.org/torch2424/as-bind.svg?branch=master)](https://travis-ci.org/torch2424/as-bind)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/as-bind.svg)
![npm](https://img.shields.io/npm/dt/as-bind.svg)
![npm version](https://img.shields.io/npm/v/as-bind.svg)
![GitHub](https://img.shields.io/github/license/torch2424/as-bind.svg)

Isomorphic library to handle passing high-level data structures between AssemblyScript and JavaScript. 🤝🚀

[Markdown Parser Demo](https://torch2424.github.io/as-bind/)

![Asbind Markdown Parser Demo Gif](./assets/asbind.gif)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Additional Examples](#additional-examples)
- [Supported Data Types](#supported-data-types)
- [Supported AssemblyScript Runtime Variants](#supported-assemblyscript-runtime-variants)
- [Reference API](#reference-api)
- [Motivation](#motivation)
- [Performance](#performance)
- [Production](#production)
- [Projects using as-bind](#projects-using-as-bind)
- [FAQ and Common Issues](#faq-and-common-issues)
- [Contributing](#contributing)
- [License](#license)

## Features

- The library is Isomorphic. Meaning it supports both the Browser, and Node! And has ESM, CommonJS, and IIFE bundles! 🌐
- Wraps around the [AssemblyScript Loader](https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader). The loader handles all the heavy-lifting of passing data into WebAssembly linear memory. 💪
- Wraps around imported JavaScript functions, and exported AssemblyScript functions of the AssemblyScript Wasm Module. This allows high-level data types to be passed directly to exported AssemblyScript functions! 🤯
- The library works at runtime, so no generated code that you have to maintain and make it play nicely in your environment. 🏃
- Maintains great performance (relative to generating the corresponding JavaScript code), by using [Speculative Execution](https://en.wikipedia.org/wiki/Speculative_execution), and caching types passed between functions. 🤔
- Installable from package managers (npm), with a modern JavaScript API syntax. 📦
- The library is [< 5KB (minified and gzip'd)](https://bundlephobia.com/result?p=as-bind) and tree-shakeable! 🌲
- This library is currently (as of January, 2020) the [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen) in the Rust/Wasm ecosystem, for AssemblyScript. 😀

## Installation

You can install as-bind in your project by running the following:

`npm install --save as-bind`

## Quick Start

**1. Compiling your Assemblyscript**

To enable as-bind for your AssemblyScript Wasm modules, add the as-bind entrypoint when compiling your module:

`asc ./node_modules/as-bind/lib/assembly/as-bind.ts your-entryfile.ts --runtime incremental --exportRuntime [...other cli options...]`

The things to notice are:

- `./node_modules/as-bind/lib/assembly/as-bind.ts` - This is the as-bind entryfile, used for exporting IDs of AssemblyScript classes so we can use them for instantiating new classes
- `--runtime incremental` - This specifies that we are using the incremental runtime / garbage collection option (The AssemblyScript default). However, [all the runtime options](https://www.assemblyscript.org/garbage-collection.html) are supported (incremental, minimal, and stub).
- `--exportRuntime` - This allows us to use the [AssemblyScript Garbage Collection functions added in 0.18.x](https://www.assemblyscript.org/garbage-collection.html)

For **optional testing purposes** , let's export an example function we can try in `your-entryfile.ts`:

```typescript
export function myExportedFunctionThatTakesAString(value: string): string {
  return "AsBind: " + value;
}
```

**2. In your Javascript**

For **browser** JavaScript. We can do the following:

```javascript
// If you are using a Javascript bundler, use the ESM bundle with import syntax
import { AsBind } from "as-bind";

// If you are not using a bundler add a <script> tag to your HTML
// Where the `src` points to the iife bundle (as-bind.iife.js), for example: https://unpkg.com/as-bind
// Then, INSTEAD of using the import syntax, do: `const { AsBind } = AsBindIIFE;`

const wasm = fetch("./path-to-my-wasm.wasm");

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);

  // You can now use your wasm / as-bind instance!
  const response = asBindInstance.exports.myExportedFunctionThatTakesAString(
    "Hello World!"
  );
  console.log(response); // AsBind: Hello World!
};
asyncTask();
```

For **Node** JavaScript, we would use the CommonJS bundle by do the following:

```javascript
const { AsBind } = require("as-bind");
const fs = require("fs");

const wasm = fs.readFileSync("./path-to-my-wasm.wasm");

const asyncTask = async () => {
  const asBindInstance = await AsBind.instantiate(wasm);

  // You can now use your wasm / as-bind instance!
  const response = asBindInstance.exports.myExportedFunctionThatTakesAString(
    "Hello World!"
  );
  console.log(response); // AsBind: Hello World!
};
asyncTask();
```

_Did the quick start not work for you, or you are noticing some weird behavior? Please see the [FAQ and Common Issues](#faq-and-common-issues)_

_Want to use `as-bind` in production? Please see the [Production section in the FAQ and Common Issues](#production)_

## Additional Examples

## Passing a high-level type to a an exported function, and returning a high-level type

[See the Quick Start](#quick-start)

## Passing a high-level type to an imported function

In this example, we will implement a `console.log` that we can call from AssemblyScript!

**AssemblyScript**

Inside of `myWasmFileName.ts`:

```typescript
declare function consoleLog(message: string): void;

export function myExportedFunctionThatWillCallConsoleLog(): void {
  consoleLog("Hello from AS!");
}
```

**JavaScript**

```javascript
import { AsBind } from "as-bind";

const wasm = fetch("./path-to-my-wasm.wasm");

const asyncTask = async () => {
  // Instantiate the wasm file, and pass in our importObject
  const asBindInstance = await AsBind.instantiate(wasm, {
    myWasmFileName: {
      consoleLog: message => {
        console.log(message);
      }
    }
  });

  // Should call consoleLog, and log: "Hello from AS!"
  asBindInstance.exports.myExportedFunctionThatWillCallConsoleLog();
};
asyncTask();
```

## Supported Data Types

**TL;DR:** Currently Numbers, Strings, Typed Arrays, and common Array<T> types are supported. Returning a high-level data type from an imported JavaScript function, and better AssemblyScript Class support will be coming later. For more detailed type support information, please see the [`lib/asbind-instance/supported-ref-types.js`](./lib/asbind-instance/supported-ref-types.js) and [`test/assembly/test.ts`](./test/assembly/test.ts).

<!-- Generated from: https://www.tablesgenerator.com/markdown_tables# -->

| Function Direction & AssemblyScript Type                                                                | Exported AssemblyScript Function Parameters | Exported AssemblyScript Function Return | Imported JavaScript Function Paramters | Imported JavaScript Function Return |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------- | -------------------------------------- | ----------------------------------- |
| [Number (32-bit Integers and 32-bit / 64-bit Floats)](https://www.assemblyscript.org/types.html#types)  | ✔️                                          | ✔️                                      | ✔️                                     | ✔️                                  |
| [Strings](https://www.assemblyscript.org/stdlib/string.html#string)                                     | ✔️                                          | ✔️                                      | ✔️                                     | ❌                                  |
| [TypedArray](https://www.assemblyscript.org/stdlib/typedarray.html#typedarray)                          | ✔️                                          | ✔️                                      | ✔️                                     | ❌                                  |
| [Array<T> (Numbers, strings, booleans, etc...)](https://www.assemblyscript.org/stdlib/array.html#array) | ✔️                                          | ✔️                                      | ✔️                                     | ❌                                  |

## Supported AssemblyScript Runtime Variants

as-bind only supports AssemblyScript modules compiled with the `--runtime full` (default), and `--runtime stub` flags. These should be the only supported modes, because these runtime variants specify that you would like types / objects to be created externally as well as internally. Other runtime variants would mean that you DO NOT want anything externally created for your wasm module.

Please see the [AssemblyScript Docs on runtime variants](https://docs.assemblyscript.org/details/runtime) for more information.

## Reference API

### AsBind

The default exported ESM class of `as-bind`, also available as `import { AsBind } from "as-bind"` / `const { AsBind } = require('as-bind')`.

#### Class Properties

The `AsBind` class is meant to vaugely act as the [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) Object exposed to JavaScript environments.

##### version

`AsBind.version: string`

Value that is the current version of your imported AsBind.

##### RETURN_TYPES

`AsBind.RETURN_TYPES`

Constants (represented as JSON) of the supported return types on bound export functions. This is useful for forcing the return type on [bound export functions](#exports).

For example, this could be used like:

```typescript
// Force our return type to our expected string
asBindInstance.exports.myExportedFunctionThatReturnsAString.returnType =
  AsBind.RETURN_TYPES.STRING;
const myString = asBindInstance.exports.myExportedFunctionThatReturnsAString();

// Force our return type to return a number (The pointer to the string)
asBindInstance.exports.myExportedFunctionThatReturnsAString.returnType =
  AsBind.RETURN_TYPES.NUMBER;
const myNumber = asBindInstance.exports.myExportedFunctionThatReturnsAString();
```

##### instantiate

```typescript
AsBind.instantiate: (
  moduleOrBuffer: (
    WebAssembly.Module |
    BufferSource |
    Response |
    PromiseLike<WebAssembly.Module>
  ),
  imports?: WasmImports
) => Promise<AsBindInstance>`
```

This function is the equivalent to the [AssemblyScript Loader instantiate](https://github.com/AssemblyScript/assemblyscript/tree/master/lib/loader#api) function, which is similar to the [WebAssembly.instantiateStreaming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/instantiateStreaming) function. It essentially takes as its parameters:

- Any type of object that can be (resolved) and instantied into a WebAssembly instance. Which in our case would be an AsBindInstance.

- A [WebAssembly importObject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/WebAssembly/instantiateStreaming), which would have all of your imported functions that can be called from within your AssemblyScript module.

##### instantiateSync

```typescript
AsBind.instantiateSync: (
  moduleOrBuffer: (
    WebAssembly.Module |
    BufferSource
  ),
  imports?: WasmImports
) => AsBindInstance`
```

This is a synchronous version of `AsBind.instantiate`. This does not accept a promise-like as its module, and returns an AsBindInstance instead of a Promise that resolves an AsBindInstance. **This is only reccomended for use in testing or development**. Please see the Documentation sections for `AsBind.instantiate` for more information.

#### Instance Properties

An AsBindInstance is vaugley similar to a [WebAssembly instance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance).

##### exports

Similar to to [WebAssembly.Instance.prototype.exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance/exports), this is an object containing all of the exported fields from the WebAssembly module. However, **exported functions** are bound / wrapped in which they will handle passing the supported high-level data types to the exported AssemblyScript function.

Each **exported function** has the properties:

- `shouldCacheTypes`
  - If you would like to disable type caching (speculative execution) for a particular function, you can do: `asBindInstance.exports.myFunction.shouldCacheTypes = false;`. Or set to true, to re-enable type caching.
- `returnType`
  - (Reccomended for production usage) Set this value on a bound export function, to force it's return type. This should be set to a constant found on: [`AsBind.RETURN_TYPES`](#return_types). Defaults to `null`.
- `unsafeReturnValue`
  - By default, all values (in particular [TypedArrays](https://www.assemblyscript.org/stdlib/typedarray.html#typedarray)) will be copied out of Wasm Memory, instead of giving direct read/write access. If you would like to use a view of the returned memory, you can do: `asBindInstance.exports.myFunction.unsafeReturnValue = true;`. For More context, please see the [AssemblyScript loader documentation](https://www.assemblyscript.org/loader.html#module-instance-utility) on array views.
  - After settings this flag on a function, it will then return it's values wrapped in an object, like so: `{ptr: /* The pointer or index in wasm memory the view is reffering to */, value: /* The returned value (TypedArray) that is backed directly by Wasm Memory */}`

##### unboundExports

This is essentially the same as the [WebAssembly.Instance.prototype.exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/Instance/exports), this is an object containing all of the exported fields from the WebAssembly module. These are not bound / wrapped, so you can access the original exported functions.

##### importObject

Similar to to [WebAssembly.instantiateStreaming() importObject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming), This is the original passed importObject on instantiation, after the **importObject functions** are bound / wrapped by as-bind.

Each wrapped **importObject function** has the property: `shouldCacheTypes`. If you would like to disable type caching (speculative execution) for a particular function, you can do: `asBindInstance.importObject.myFunction.shouldCacheTypes = false;`. Or set to true, to re-enable type caching.

##### enableExportFunctionTypeCaching

Calling this method will (re-)enable type caching (speculative execution) for ALL exported functions on the AsBindInstance.

##### disableExportFunctionTypeCaching

Calling this method will disable type caching (speculative execution) for ALL exported functions on the AsBindInstance.

##### enableExportFunctionUnsafeReturnValue

Calling this method will (re-)enable unsafe return types for ALL exported functions on the AsBindInstance.

##### disableExportFunctionUnsafeReturnValue

Calling this method will disable unsafe return types for ALL exported functions on the AsBindInstance.

##### enableImportFunctionTypeCaching

Calling this method will (re-)enable type caching (speculative execution) for ALL importObject functions on the AsBindInstance.

##### disableImportFunctionTypeCaching

Calling this method will disable type caching (speculative execution) for ALL importObject functions on the AsBindInstance.

## Motivation

This library was inspired by several chats I had with some awesome buddies of mine in the WebAssembly Community:

- [Till Schneidereit](https://twitter.com/tschneidereit) and I had a chat about [WasmBoy](https://github.com/torch2424/wasmboy), and about how I had a really good experience writing the emulator, even though I had to do my own memory management. But they helped me realize, building something low level isn't that bad with manual memory management, but building something like a markdown parser would be very tedious since you have to manually write the string back and forth. Which then inspired this library, and its [markdown parser demo](https://torch2424.github.io/as-bind/).

- While I was building [WasmByExample](https://wasmbyexample.dev/?programmingLanguage=assemblyscript) I wanted to start building the "High Level Data Structures" section. I then realized how much work it would be to maintain code for passing data between WebAssembly Linear memory would be for each data type, and how much work it would be to created each individual example. Then, my buddy [Ashley Williams](https://twitter.com/ag_dubs) helped me realize, if your docs are becoming too complex, it may be a good idea to write a tool. That way you have less docs to write, and users will have an easier time using your stuff!

Thus, this library was made to help AssemblyScript/JavaScript users build awesome things! I also want to give a huge thanks to the [AssemblyScript team](https://github.com/AssemblyScript/meta) and communitty for the help they provided me. I'm super appreciative of you all! 😄🎉

## Performance

**TL;DR** This library should be fast, but depending on your project you may want some more careful consideration. 🤔

as-bind does all of its data passing at runtime. Meaning this will be slower than a code generated bindings generator, such as something like [wasm-bindgen](https://github.com/rustwasm/wasm-bindgen). This is because, as-bind needs to cycle through every supported type on every paremeter or return value for each function, whenever the function is called. However, this is mitigated due to the Speculative execution that the library implements.

Which in this case means, the library by default will assume the type of value being passed to, or returned by a function will not change. Thus, the library will only have to cycle through the params once, cache the types, and then for calls to the functions after this it would be as fast as a code generated solution (in theory). This speculative execution can be turned off as specified in the Reference API.

If your project is doing one-off processing using a high level data type, this project should have a very small impact on performance of your project. However, if you project is doing its processing in a very time constrained loop (such as a game running at 60fps), you may want to be more considerate when choosing this library. The speculative execution should greatly help in the amount of time to pass high level data types, but if your game is already not running as fast as you would like, you may want to avoid this library, or even not using high level data types, for passing memory to your WebAssembly module. However, the library also exposes all original exports under the `AsBindInstance.unboundExports` as covered in the Reference API, so you could, in theory, still access the non-bound exports without any of the performance overhead if you don't require any of the binding / wrapping that AsBind does for you.

Eventually for the most performant option, we would want to do some JavaScript code generation in the AssemblyScript compiler itself, as part of an `as-bindgen` project for the most performant data passing.

In the future, these types of high-level data passing tools will not be needed for WebAssembly toolchains, once the [WebAssembly Inteface Types proposal](https://github.com/WebAssembly/interface-types/blob/master/proposals/interface-types/Explainer.md) lands, and this functionality is handled by the runtime / toolchain.

## Production

`as-bind` works by abstracting away using the [AssemblyScript Loader](https://www.assemblyscript.org/loader.html). For passing values into your AssemblyScript, it uses the Loader on your half to allocate memory, and then passes the pointer to the allocated memory. However, to pass a value back from AssemblyScript to JavaScript, AsBind will iterate through all the supported types until it finds a match (or doesn't in which case it just returns the number). However, returning a value _can sometimes_ conflict with something in AssemblyScript memory, as discovered in [#50](https://github.com/torch2424/as-bind/issues/50).

Thus, for production usage we highly reccomend that you set the [`returnType` property on your bound export functions](#exports) to ensure that this conflict does not happen. 😄

## Projects using as-bind

- The as-bind example is a Markdown Parser, in which as-bind takes in a string, passes it to a rough markdown parser / compiler written in AssemblyScript, and returns a string. [(Live Demo)](https://torch2424.github.io/as-bind/), [(Source Code)](https://github.com/torch2424/as-bind/tree/master/examples/markdown-parser)

- [use-as-bind](https://github.com/tylervipond/use-as-bind) is a React hook for using as-bind with an as-bind enabled WASM source. It's goal is to provide a simple API for React users to add WASM to their apps. [(Live Demo)](https://tylervipond.github.io/use-as-bind/)

_If you're project is using as-bind, and you would like to be featured here. Please open a README with links to your project, and if appropriate, explaining how as-bind is being used._ 😊

## FAQ and Common Issues

> I am calling my exports, but it is not returning the types that I am returning? It seems to be returning pointers?

This is probably because you are not adding the as-bind entry file. Please see the [Quick Start](#quick-start) on how to compile your AssemblyScript module with this entry file. If this still does not work, please take a look at the [Supported Types](#supported-types) to ensure what type you are trying to pass will work.

_Didn't find a solution to your problem? Feel free to open an issue!_

## Contributing

Contributions are definitely welcome! Feel free to open a PR for small fixes such as typos and things. Larger fixes, or new features should start out as an issue for discussion, in which then a PR should be made. 🥳

This project will also adhere to the [AssemblyScript Code of Conduct](https://github.com/AssemblyScript/assemblyscript/blob/master/CODE_OF_CONDUCT.md).

## License

[MIT](https://oss.ninja/mit/torch2424). 📝
