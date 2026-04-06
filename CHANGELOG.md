# Changelog

All notable changes to this project are documented here.

## [2.0.0] - 2026-04-05

### Changed

- reset the product around a single `webpolyglot` package
- made `webpolyglot` the canonical CLI entrypoint
- changed init to generate provider/setup files instead of mutating app source
- added framework detection and package-manager detection
- added non-interactive init flags for automation and smoke testing
- cleaned publish artifacts and added tarball verification scripts

### Removed

- the old two-package mental model
- loader-era docs and stale generated declaration artifacts
- fragile auto-injection as a default setup path
