# ramble
Ramble v2.0

### Spec

- 2 texts
- 1 rambler (one instance of Rambler)
 - 2 copies of sources: `words = { rural: [words], urban: [words] }`
 - 2 histories: `history = { rural: [history], urban: [history] }`
 - outgoing/incoming state
 - destination, one of: `const destinations = ['rural', 'urban']`

#### Rambler Behavior
- OUTGOING: add replaced words to both histories: rural and urban; also keep the copied words arrays up-to-date.
- INCOMING: pull from history for current destination only
- ON_RETURN after each even leg:
 -  simply reinitialize both words and histories from source

----

