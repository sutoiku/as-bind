// The entry file of your WebAssembly module.

// User submitted issues

// Learned from this, you must use a TypedArray, and not something like: Array<f64>
export function issue28(arr: Float64Array): f64 {
  let sum: f64 = 2.0;
  for (let i = 0; i < 3; ++i) {
    sum += arr[i];
  }
  return arr.length;
}

// Basic value Passing

export function helloWorld(world: string): string {
  return "Hello " + world + "!";
}

export function helloWorldTwo(world: string, worldTwo: string): string {
  return "Hello " + world + " and " + worldTwo + "!";
}

export function refAndNumberArgsReturnsRef(ref: string, num: i32): string {
  return "Ref: " + ref + " Number: " + num.toString();
}

export function numberAndRefArgsReturnsRef(num: i32, ref: string): string {
  return "Ref: " + ref + " Number: " + num.toString();
}

export function numberAndRefArgsReturnsNumber(num: i32, ref: string): i32 {
  return ref.length + num;
}

export function Int32Support(value: i32): i32 {
  return value + 1;
}

export function Float32Support(value: f32): f32 {
  return value + 1.0;
}

export function Float64Support(value: f64): f64 {
  return value + 1.0;
}

export function mapInt8Array(array: Int8Array): Int8Array {
  return array.map((value: i8) => value * 2);
}

export function mapUint8Array(array: Uint8Array): Uint8Array {
  return array.map((value: u8) => value * 2);
}

export function mapInt16Array(array: Int16Array): Int16Array {
  return array.map((value: i16) => value * 2);
}

export function mapUint16Array(array: Uint16Array): Uint16Array {
  return array.map((value: u16) => value * 2);
}

export function mapInt32Array(array: Int32Array): Int32Array {
  return array.map((value: i32) => value * 2);
}

export function mapUint32Array(array: Uint32Array): Uint32Array {
  return array.map((value: u32) => value * 2);
}

export function mapFloat32Array(array: Float32Array): Float32Array {
  return array.map((value: f32) => value * 2);
}

export function mapFloat64Array(array: Float64Array): Float64Array {
  return array.map((value: f64) => value * 2);
}

export function mapBigInt64Array(array: Int64Array): Int64Array {
  return array.map((value: i64) => value * 2);
}

export function mapBigUint64Array(array: Uint64Array): Uint64Array {
  return array.map((value: u64) => value * 2);
}

export function mapI32Array(array: Array<i32>): Array<i32> {
  return array.map<i32>((value: i32) => value * 2);
}

export function mapI64Array(array: Array<i64>): Array<i64> {
  return array.map<i64>((value: i64) => value * 2);
}

export function mapStringArray(array: Array<string>): Array<string> {
  return array.map<string>((value: string) => "#" + value);
}

export function mapBoolArray(array: Array<bool>): Array<bool> {
  return array.map<bool>((value: bool) => !value);
}

export function mapI32ArrayArray(array: Array<Array<i32>>): Array<Array<i32>> {
  return array.map<Array<i32>>((value: Array<i32>) =>
    value.map<i32>((v: i32) => v * 2)
  );
}

export function mapI64ArrayArray(array: Array<Array<i64>>): Array<Array<i64>> {
  return array.map<Array<i64>>((value: Array<i64>) =>
    value.map<i64>((v: i64) => v * 2)
  );
}

export function mapStringArrayArray(
  array: Array<Array<string>>
): Array<Array<string>> {
  return array.map<Array<string>>((value: Array<string>) =>
    value.map<string>((v: string) => "#" + v)
  );
}

export function mapBoolArrayArray(
  array: Array<Array<bool>>
): Array<Array<bool>> {
  return array.map<Array<bool>>((value: Array<bool>) =>
    value.map<bool>((v: bool) => !v)
  );
}

export function getInt8ArrayLength(array: i8[]): i32 {
  return array.length;
}

export function getUint8ArrayLength(array: u8[]): i32 {
  return array.length;
}

export function getInt16ArrayLength(array: i16[]): i32 {
  return array.length;
}

export function getUint16ArrayLength(array: u16[]): i32 {
  return array.length;
}

export function getInt32ArrayLength(array: i32[]): i32 {
  return array.length;
}

export function getUint32ArrayLength(array: u32[]): i32 {
  return array.length;
}

export function getInt64ArrayLength(array: i64[]): i32 {
  return array.length;
}

export function getUint64ArrayLength(array: u64[]): i32 {
  return array.length;
}

export function getFloat32ArrayLength(array: f32[]): i32 {
  return array.length;
}

export function getFloat64ArrayLength(array: f64[]): i32 {
  return array.length;
}

declare function testImportString(value: string): void;
export function callTestImportString(value: string): void {
  testImportString(value);
}

declare function testImportTwoStrings(valueOne: string, valueTwo: string): void;
export function callTestImportTwoStrings(
  valueOne: string,
  valueTwo: string
): void {
  testImportTwoStrings(valueOne, valueTwo);
}

declare function testImportReturnNumber(): i32;
export function callTestImportReturnNumber(): i32 {
  let response: i32 = testImportReturnNumber();
  return response;
}

declare function testImportInt8Array(value: Int8Array): void;
export function callTestImportInt8Array(value: Int8Array): void {
  testImportInt8Array(value);
}

declare function testImportUint8Array(value: Uint8Array): void;
export function callTestImportUint8Array(value: Uint8Array): void {
  testImportUint8Array(value);
}

declare function testImportInt16Array(value: Int16Array): void;
export function callTestImportInt16Array(value: Int16Array): void {
  testImportInt16Array(value);
}

declare function testImportUint16Array(value: Uint16Array): void;
export function callTestImportUint16Array(value: Uint16Array): void {
  testImportUint16Array(value);
}

declare function testImportInt32Array(value: Int32Array): void;
export function callTestImportInt32Array(value: Int32Array): void {
  testImportInt32Array(value);
}

declare function testImportUint32Array(value: Uint32Array): void;
export function callTestImportUint32Array(value: Uint32Array): void {
  testImportUint32Array(value);
}

declare function testImportFloat32Array(value: Float32Array): void;
export function callTestImportFloat32Array(value: Float32Array): void {
  testImportFloat32Array(value);
}

declare function testImportFloat64Array(value: Float64Array): void;
export function callTestImportFloat64Array(value: Float64Array): void {
  testImportFloat64Array(value);
}
