# ramble
Ramble v2.0

### spec

- 2 texts [rural, urban]
- 2 histories: [rural, urban]
- 1 current destination
 
- 1 rambler
  - outgoing/incoming state
  - current destination text
  - two histories
    - if going out, add replaced words to both histories
    - returning, pull from history for destination only
    - but once returned (from an incoming leg) it should detect where it has 'arrived' (urban or rural) so that when it sets out again it collects an alternate history 'as if' (in that alternative) is was setting out from that alternate destinatination. so a rambler (at any index point) it will always be able get back to either possible desitination (which might have changed). So, in operations:
    - detect 'where', which desitination urban or rural a rambler has returned to
    - set initial word of its 'shadow'/'alternate' history to the *other* possible destination

