# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.2-next.42](https://github.com/simple-html/simple-html/compare/v0.0.2-next.41...v0.0.2-next.42) (2021-07-05)

### [0.0.2-next.41](https://github.com/simple-html/simple-html/compare/v0.0.2-next.40...v0.0.2-next.41) (2021-07-05)


### Features

* hide not selected ([99df515](https://github.com/simple-html/simple-html/commits/99df51582906557ed125c5c9f3829c0f7b9ffdd3))

### [0.0.2-next.40](https://github.com/simple-html/simple-html/compare/v0.0.2-next.39...v0.0.2-next.40) (2021-07-04)


### Features

* deselect item if selected before (is using control key) ([aa85e47](https://github.com/simple-html/simple-html/commits/aa85e47edba968112c267d1452b2b547373780ca))

### [0.0.2-next.39](https://github.com/simple-html/simple-html/compare/v0.0.2-next.38...v0.0.2-next.39) (2021-07-03)


### Features

* set focus point for orbit control to last selected ([5a2c6e2](https://github.com/simple-html/simple-html/commits/5a2c6e2a65c4411a783e38ecaa3fb6f0f1780fd0))

### [0.0.2-next.38](https://github.com/simple-html/simple-html/compare/v0.0.2-next.36...v0.0.2-next.38) (2021-07-01)


### Features

* highligh all geometry with same expressid ([1673143](https://github.com/simple-html/simple-html/commits/16731434f7791ae023e6e9e1c290361beeeaf3f5))


### Bug Fixes

* selection when loaded many files ([3bafc29](https://github.com/simple-html/simple-html/commits/3bafc299bedc8b9582131ebcd1760a0a4fca105c))

### [0.0.2-next.37](https://github.com/simple-html/simple-html/compare/v0.0.2-next.35...v0.0.2-next.36) (2021-06-30)

- custom wasm file -> https://github.com/tomvandig/web-ifc/pull/57

### [0.0.2-next.36](https://github.com/simple-html/simple-html/compare/v0.0.2-next.35...v0.0.2-next.36) (2021-06-30)

### [0.0.2-next.35](https://github.com/simple-html/simple-html/compare/v0.0.2-next.32...v0.0.2-next.35) (2021-06-30)


### Features

* center model so clipping just works, and show loading progress(just file count) ([e8abb2e](https://github.com/simple-html/simple-html/commits/e8abb2e9fdd809d188ee1a6c25a27c3ce41e06ce))
* show version in gui, so we dont need to open console ([9491699](https://github.com/simple-html/simple-html/commits/9491699a8e685da9060694cd41abf6a66dd60457))
* simple select (needs more work) ([385e8fc](https://github.com/simple-html/simple-html/commits/385e8fca0b9ecbb455cac740935334e7c4fecf24))


### Bug Fixes

* clipping planes ([ce73e26](https://github.com/simple-html/simple-html/commits/ce73e2617a30ad81dd35e73fb7bef2f50fa54b0e))
* remove firstHitOnly on raycaster ([ca0acbb](https://github.com/simple-html/simple-html/commits/ca0acbb1ae096da31242ae70bf4c344faacc6c18))
* selected to follow clipping plane rules ([eada0e8](https://github.com/simple-html/simple-html/commits/eada0e88a1a6127199805ecbdf2579e0db4989d4))
* temp fix for plane clipping bug ([1877ada](https://github.com/simple-html/simple-html/commits/1877adab5231bfcee9c51929bdc2251df1bf3a4f))

### [0.0.2-next.32](https://github.com/simple-html/simple-html/compare/v0.0.2-next.31...v0.0.2-next.32) (2021-06-18)

### Bug Fixes

-   revert range experiment - not a good fit
    ([d557ef3](https://github.com/simple-html/simple-html/commits/d557ef37a249e81723028c709dffe1467c3fef0c))

### [0.0.2-next.31](https://github.com/simple-html/simple-html/compare/v0.0.2-next.30...v0.0.2-next.31) (2021-06-18)

### Bug Fixes

-   speed up selection a little (will try and use buffers directly)
    ([c13576b](https://github.com/simple-html/simple-html/commits/c13576b123f641011b47ee956de7a85c667cf305))
-   use faster material
    ([1dfcf2b](https://github.com/simple-html/simple-html/commits/1dfcf2b9d882aede986db9836965a8e58e6c9755))

### [0.0.2-next.30](https://github.com/simple-html/simple-html/compare/v0.0.2-next.29...v0.0.2-next.30) (2021-06-18)

### Bug Fixes

-   broken selection after last range update
    ([c37ae4e](https://github.com/simple-html/simple-html/commits/c37ae4e49996fef585076b3a2e652056d972ca33))

### [0.0.2-next.29](https://github.com/simple-html/simple-html/compare/v0.0.2-next.28...v0.0.2-next.29) (2021-06-18)

### Features

-   test with update range on color
    ([122bf3e](https://github.com/simple-html/simple-html/commits/122bf3e5450f72cb779e1fa41dd8f066058813b0))

### [0.0.2-next.28](https://github.com/simple-html/simple-html/compare/v0.0.2-next.27...v0.0.2-next.28) (2021-06-15)

### Features

-   collection map so I know what geometry that belongs together so I can highlight all
    ([62a2b63](https://github.com/simple-html/simple-html/commits/62a2b6333a6215284351851253d18083d422d3d8))
-   select entire collection (all with same ifc in file, not just geometry parts)
    ([1c07537](https://github.com/simple-html/simple-html/commits/1c075377f61b234f3e9c718052b64075c01cba57))

### Bug Fixes

-   isvalidURL - check if value is string before using it
    ([47ea7c0](https://github.com/simple-html/simple-html/commits/47ea7c0ae54f333c6387a146a48ab408a0e85830))
-   selection
    ([e6d44dd](https://github.com/simple-html/simple-html/commits/e6d44dde80eadc1bdd10ff55d70d424e214e6ff4))

### [0.0.2-next.27](https://github.com/simple-html/simple-html/compare/v0.0.2-next.26...v0.0.2-next.27) (2021-06-15)

### Features

-   minor fixes to rest api integration and make url nicer
    ([cc40349](https://github.com/simple-html/simple-html/commits/cc4034950dece8ed867a3d1b568c15b5e5e9a223))

### [0.0.2-next.26](https://github.com/simple-html/simple-html/compare/v0.0.2-next.25...v0.0.2-next.26) (2021-06-15)

### Bug Fixes

-   firefox does not have memory stats on chrome
    ([cc88288](https://github.com/simple-html/simple-html/commits/cc8828842bc1c4cbc1d9b7352a076015e51d2526))

### [0.0.2-next.25](https://github.com/simple-html/simple-html/compare/v0.0.2-next.24...v0.0.2-next.25) (2021-06-14)

### [0.0.2-next.24](https://github.com/simple-html/simple-html/compare/v0.0.2-next.23...v0.0.2-next.24) (2021-06-14)

### Features

-   select multiple files and load
    ([4c215d9](https://github.com/simple-html/simple-html/commits/4c215d9e78f41319986fd29902cfbf5c03c5d044))

### Bug Fixes

-   handle errors on ifc files better, just print to console and not stop
    ([56105e1](https://github.com/simple-html/simple-html/commits/56105e1b22c4aa989a6a9af8e948af729fc9dab3))

### [0.0.2-next.23](https://github.com/simple-html/simple-html/compare/v0.0.2-next.22...v0.0.2-next.23) (2021-06-14)

### Features

-   simple data fetch from server side, just for fun atm
    ([2d5e756](https://github.com/simple-html/simple-html/commits/2d5e756fd2dc68c353bd7486afdb6df723b2e532))

### [0.0.2-next.22](https://github.com/simple-html/simple-html/compare/v0.0.2-next.21...v0.0.2-next.22) (2021-06-14)

### Features

-   add launch config for debugger from vscode
    ([6feaa97](https://github.com/simple-html/simple-html/commits/6feaa9740a35144aa0d7b0a61c76d6544aaf1d20))
-   simple ground plane and clipping tools first draft
    ([a32c0ae](https://github.com/simple-html/simple-html/commits/a32c0ae3f620616f9aa3ab34e39ca5be9876ef26))

### Bug Fixes

-   remove controller code
    ([3d16aa4](https://github.com/simple-html/simple-html/commits/3d16aa4a23bb1b0d9fe3a7b373cdc19855d0304f))

### [0.0.2-next.21](https://github.com/simple-html/simple-html/compare/v0.0.2-next.20...v0.0.2-next.21) (2021-06-07)

### Bug Fixes

-   make it possible to hide buttons and hide not selected button added
    ([e081af1](https://github.com/simple-html/simple-html/commits/e081af1f432bd6683bf48e2b84899a11535e46f5))

### [0.0.2-next.20](https://github.com/simple-html/simple-html/compare/v0.0.2-next.19...v0.0.2-next.20) (2021-06-07)

### [0.0.2-next.19](https://github.com/simple-html/simple-html/compare/v0.0.2-next.18...v0.0.2-next.19) (2021-06-07)

### Features

-   clear scene
    ([0315077](https://github.com/simple-html/simple-html/commits/0315077bbf9076df9f5e98bcd98e783f03fec2ea))
-   load propertySet in controller fileload args
    ([ffbf131](https://github.com/simple-html/simple-html/commits/ffbf13122b9a2fa100ea45378f1ae24dc4cd6856))
-   toggle wireframe
    ([fded8b9](https://github.com/simple-html/simple-html/commits/fded8b9a790d554a10b70c35b5b4cafaa343d053))

### [0.0.2-next.18](https://github.com/simple-html/simple-html/compare/v0.0.2-next.17...v0.0.2-next.18) (2021-06-06)

### Features

-   wireless spacemouse support
    ([d3fcc3f](https://github.com/simple-html/simple-html/commits/d3fcc3ff2a82c0e5287762c6c29246f9d8f07991))

### [0.0.2-next.17](https://github.com/simple-html/simple-html/compare/v0.0.2-next.16...v0.0.2-next.17) (2021-06-06)

### [0.0.2-next.16](https://github.com/simple-html/simple-html/compare/v0.0.2-next.15...v0.0.2-next.16) (2021-06-06)

### Features

-   set focus to last selected (camera)
    ([368312e](https://github.com/simple-html/simple-html/commits/368312e1a5604d456f7f19c3c349b730df173dea))

### Bug Fixes

-   dont try and read file if user cancels
    ([526ce6b](https://github.com/simple-html/simple-html/commits/526ce6bc1310af919d891ea15bdfd763be1c8f02))

### [0.0.2-next.15](https://github.com/simple-html/simple-html/compare/v0.0.2-next.14...v0.0.2-next.15) (2021-06-06)

### [0.0.2-next.14](https://github.com/simple-html/simple-html/compare/v0.0.2-next.13...v0.0.2-next.14) (2021-06-06)

### Features

-   invert selection
    ([8c20e51](https://github.com/simple-html/simple-html/commits/8c20e511e7da9811bae919230a38a97efc9355ac))

### [0.0.2-next.13](https://github.com/simple-html/simple-html/compare/v0.0.2-next.12...v0.0.2-next.13) (2021-06-06)

### Features

-   add space navigator as option
    ([a1a5b8c](https://github.com/simple-html/simple-html/commits/a1a5b8c997d09b8379ce59f04ad38a2a22442266))

### [0.0.2-next.12](https://github.com/simple-html/simple-html/compare/v0.0.2-next.11...v0.0.2-next.12) (2021-06-05)

### Features

-   show gpu color & hide selected & show all
    ([659e0e3](https://github.com/simple-html/simple-html/commits/659e0e318a1e75c6b4fac5acd8cfed9d1a31c62d))

### [0.0.2-next.11](https://github.com/simple-html/simple-html/compare/v0.0.2-next.10...v0.0.2-next.11) (2021-06-05)

### Features

-   deselect with contr key and not select when rotating
    ([11d3a4a](https://github.com/simple-html/simple-html/commits/11d3a4ac3453dcd52d959572660555bfc0686aa8))
-   multi select by holding contr down
    ([e95461d](https://github.com/simple-html/simple-html/commits/e95461d501d11255394b05696a66dae5a816112c))
-   print version to console
    ([1db59ed](https://github.com/simple-html/simple-html/commits/1db59ed9077582db7981868ce6450f58424bb27d))

### [0.0.2-next.10](https://github.com/simple-html/simple-html/compare/v0.0.2-next.9...v0.0.2-next.10) (2021-06-05)

### [0.0.2-next.9](https://github.com/simple-html/simple-html/compare/v0.0.2-next.8...v0.0.2-next.9) (2021-06-05)

### [0.0.2-next.8](https://github.com/simple-html/simple-html/compare/v0.0.2-next.7...v0.0.2-next.8) (2021-06-04)

### [0.0.2-next.7](https://github.com/simple-html/simple-html/compare/v0.0.2-next.6...v0.0.2-next.7) (2021-06-04)

### [0.0.2-next.6](https://github.com/simple-html/simple-html/compare/v0.0.2-next.5...v0.0.2-next.6) (2021-06-04)

### [0.0.2-next.5](https://github.com/simple-html/simple-html/compare/v0.0.2-next.4...v0.0.2-next.5) (2021-06-04)

### [0.0.2-next.4](https://github.com/simple-html/simple-html/compare/v0.0.2-next.3...v0.0.2-next.4) (2021-06-04)

### [0.0.2-next.3](https://github.com/simple-html/simple-html/compare/v0.0.2-next.2...v0.0.2-next.3) (2021-06-04)

### [0.0.2-next.2](https://github.com/simple-html/simple-html/compare/v0.0.2-next.1...v0.0.2-next.2) (2021-06-04)

### [0.0.2-next.1](https://github.com/simple-html/simple-html/compare/v0.0.2-next.0...v0.0.2-next.1) (2021-06-04)

### 0.0.2-next.0 (2021-06-04)
