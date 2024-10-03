---
title: "C (Programming Language)"
description: "Rare C snippets and features."
#pubDate: Tue 12 Sep 2023 03:52:38 PM PDT
pubDate: 2023-09-12T23:24:17.710Z
tags:
- programming
slug: C
---

## Contents

- [Compiler Attributes](#compiler-attributes)
    - [Constructors](#constructors)
    - [Aliasing](#aliasing)
    - [Type Modes](#type-modes)
    - [Struct Packing](#struct-packing)
- [Useful Macros](#useful-macros)


# Compiler Attributes

`__attribute__` is used to give the compiler extra information about some code.

Compilers support different attributes so use the `__has_attibute` macro to
check if a certain attribute is supported by the compiler being used.

```c
#if ! __has_attribute(nonull)
#  error "nonull attribute is required"
#endif
```

Pragma:
The `#pragma` macro is similar to `__attribute__` except it sets attributes for
multiple functions, types, or variables.

## Constructors

Yes C has constructors but they are not like constructors in object oriented
programming. `__attribute__((constructor))` functions run before main.
`__attribute__((constructor(1)))` will run before
`__attribute__((constructor(2)))` however constructors 0 - 100 are reserved and
`__attribute__((constructor))` with no arguments will always run as the last
constructor.

There is also a deconstructor attribute that runs after main.

```c
void setup(int, char**) __attribute__((constructor)); // runs before main
void teardown(void) __attribute__((destructor));      // runs after main or exit()

void setup(int argc, char** argv) {
    printf("this function runs before main()\n");
}

void teardown(void) {
    printf("this function runs after main() or after exit() is called\n");
}
```

## Cleanup

TODO: look into `__attribute__(cleanup(func_ptr))`

## Type Modes

The type mode attribute lets you set the size of a number type. Use either `__mode__` or `mode` to tell the compiler how many bits the type has. It is typically used like

```c
typedef int __attribute__((__mode__(QI))) int8;
```

| mode argument | size in bytes | number type |
| ------------- |:------------- |:----------- |
| QI            | 1             | int         |
| HI            | 2             | int         |
| SI            | 4             | int         |
| DI            | 8             | int         |
| TI            | 16            | int         |
| SF            | 4             | float       |
| DF            | 8             | float       |

## Aliasing

The alias attribute allows you to make aliases for functions, and variables

```c
void exec(void) { printf("executing...\n"); }
void run(void) __attribute__((alias("exec"))); // will call exec when run is called.
```

## Struct Packing

Structs have a default packing size of 4 bytes, meaning that each field is put into a 4 byte section even if it is smaller than 4 bytes. With the packed attibute you can change the default packing to make smaller structs.

```c
struct __attribute__((packed)) some_struct // gets rid of struct packing
{
    int a;
    char b;
}; // `sizeof(struct some_struct)` is 5 bytes large instead of 8 bytes

// packed with 8 byte sections
struct __attribute__((packed, aligned(8))) bigger {
    int  a;
    int  b;
    char c;
}; // `sizeof(struct bigger)` is 16 bytes instead of 12
```

# Useful Macros

The table found [here](http://nadeausoftware.com/articles/2012/10/c_c_tip_how_detect_
compiler_name_and_version_using_compiler_predefined_macros) shows the different
compilers and the macros that they have. Some macros are defined in multiple
compilers. For example, `__GNUC__` is defined in the clang/llvm, gnu [[gcc|gcc/g++]],
and Intel icc/icpc compilers to show compatibility. So check the table to be sure.

## Related

- [[gcc]]
