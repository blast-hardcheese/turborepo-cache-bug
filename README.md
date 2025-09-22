# turborepo-bug

Problem
---

Remote cached "Full turbo" causes every single file to be modified exactly once, even if _we_ were the ones populating the cache.

Ideally turbo would be even smarter, only modifying files whose contents differ from the cache.

Setup
---

Please ensure you `yarn dlx turbo@canary login` && `yarn dlx turbo@canary link`

Case 1: node + rsync
---

Tasks executed outside of turbo correctly only emit `fs.watch` events when files have changed:

    # "watcher" terminal:
    $ yarn watch-for-bug

    # "builder" terminal:
    $ yarn run build && yarn run copy-if-changed

Case 2: node + turbo
---

Every time a cache invalidation happens, every single file in the "outputs" directory gets touched

    # "watcher" terminal:
    $ yarn watch-for-bug

    # "builder" terminal:
    $ yarn run turbo-build --force  # No output, since `copy-if-changed` carefully checks to see if any files need to be copied before selectively doing so
    $ yarn run turbo-build          # Hits the cache, overwriting every file with the exact same contents, emitting fs.watch notifications unnecessarily
    $ yarn run turbo-build          # Hits the cache, cached files are already on the disk, we do not emit any further fs.watch events
    $ ...                           # Subsequent runs do not emit further fs.watch events
