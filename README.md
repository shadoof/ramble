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
- OUTGOING: add replaced words to both histories: rural and urban; also keep the respective (previously copied-from-sources) rambler.words arrays up-to-date.
- INCOMING: pull from history for current destination only
- ON_RETURN after each *even* leg:
 - reinitialize both histories, can use initHistory()
 - take actual then displayed words from the display and put them into a new array replacing ramble.words[current_destination]
 - reinitialize rambler.words[not_current_desination] to those of the the corresponding source

----

