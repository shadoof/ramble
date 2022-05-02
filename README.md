# ramble
Ramble v2.0 "Preoccupations"

### Visualization Ring (it's not really a progress bar)

This needs an overhaul. I think, if we go non-strict (probably best) then first: we ignore all `stops`:
- the full circle of the bar should equal all the replaceable words (number is equal for the texts). At any one moment, starting from top and heading counter-clockwise:
- first section of the bar = words that only appear in the urban text -> Red
- second section = replaceable words that are in both texts -> Purple
- third section = replaceable words that are in neither text (i.e. they are `similars`) -> light Yellow? or tasteful Orange?
- fourth section = words that only appear in the rural text -> Blue
- 1st + 2nd + 3rd + 4th always = 100% of replaceable words.

I realize that this may cause – I'm guessing here because I haven't tried to follow how John's code works – major problems for any animation of the section ends and their movement, but this would be a much better representation of what is going on (for example: the current 'overlap' is not actually *the* or a particular overlap since `similars` are not represented at all by a color; at best it is *an* overlap), and please **read to the end**.

The reason why the current `strict` bar/circle works better is that is it structured similarly to what is proposed above, but it is more simple and works like this:
- the full circle of the bar (implicitly) represents all words that differ between the texts
- first section (origin at top, extends counter-clockwise) is the percentage belonging to urban -> Red
- *third* section (origin at top, extends clockwise) is percentage belonging to rural -> Blue
- the implicit "second" section equals `similars` from the set of *unshared* words -> light Yellow? or tasteful Orange?

This does imply a possible **solution** for the animation problem (except for any movement of the division between colors in the first section here):
- the bar extending from top and heading counter-clockwise has two sections: replaceable urban-only words (Red) + replaceable words in both texts (Purple)
- the bar extending from top and heading clockwise: replaceable rural-only words (Blue)
- the gap (which would be in the position of a third section above) would be equal to: `similars` (light Yellow? or tasteful Orange?)

If we wanted to be *very* cool, we would make it so that the 'gap' which represents `similars` appeared to be on the end of whichever `domain` is current. (The meaning of this would be that similars are being taken from the current `domain`.) This would have the additional benefit of signaling whenever the domain switches !
