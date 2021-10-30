
const sources = {
  rural: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'moss', 'and', 'floor', 'of', 'the', 'woods', 'on', 'the', 'westerly', 'facing', 'lakeside', 'slopes', ',', 'you', 'or', 'I', 'will', 'have', 'set', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'circadian', ',', 'usually', 'diurnal', ',', 'event', 'on', 'mildly', 'rambling', 'familiar', 'walks', ',', 'as', 'if', 'these', 'exertions', 'might', 'be', 'journeys', 'of', 'adventure', 'whereas', 'always', 'our', 'gestures', ',', 'guided', 'by', 'paths', ',', 'are', 'also', 'more', 'like', 'traces', 'of', 'universal', 'daily', 'ritual', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'dip', ',', 'in', 'anticipation', 'of', 'breakfast', ',', 'whenever', 'the', 'fish', 'are', 'still', 'biting', ',', 'as', 'and', 'when', 'the', 'industrious', 'creatures', 'are', 'building', 'their', 'nests', 'and', 'shelters', ',', 'after', 'our', 'own', 'trials', 'of', 'work', ',', 'while', 'the', 'birds', 'still', 'sing', ',', 'in', 'quiet', 'moments', 'after', 'lunch', ',', 'most', 'particularly', 'after', 'dinner', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'animal', 'or', 'inhuman', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'passion', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'ramble', ',', 'this', 'before', 'or', 'after', 'walk', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'walking', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'moss', ',', 'under', 'the', 'limbs', 'of', 'the', 'evergreens', ',', 'beside', 'the', 'lake', ',', 'within', 'the', 'sound', 'of', 'its', 'lapping', 'waves', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'walking', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'settled', ',', 'hearth', 'held', 'fire', 'in', 'its', 'place', ',', 'returned'],
  urban: ['by', 'the', 'time', 'the', 'light', 'has', 'faded', ',', 'as', 'the', 'last', 'of', 'the', 'reddish', 'gold', 'illumination', 'comes', 'to', 'rest', ',', 'then', 'imperceptibly', 'spreads', 'out', 'over', 'the', 'dust', 'and', 'rubble', 'of', 'the', 'craters', 'on', 'the', 'easterly', 'facing', 'bankside', 'heights', ',', 'you', 'or', 'I', 'will', 'have', 'rushed', 'out', 'on', 'several', 'of', 'yet', 'more', 'circuits', 'at', 'every', 'time', 'and', 'in', 'all', 'directions', ',', 'before', 'or', 'after', 'this', 'or', 'that', 'violent', ',', 'usually', 'nocturnal', ',', 'event', 'on', 'desperately', 'hurried', 'unfamiliar', 'flights', ',', 'as', 'if', 'these', 'panics', 'might', 'be', 'movements', 'of', 'desire', 'whereas', 'always', 'our', 'gestures', ',', 'constrained', 'by', 'obstacles', ',', 'are', 'also', 'more', 'like', 'scars', 'of', 'universal', 'daily', 'terror', ':', 'just', 'before', 'or', 'with', 'the', 'dawn', ',', 'after', 'a', 'morning', 'prayer', ',', 'in', 'anticipation', 'of', 'hunger', ',', 'while', 'the', 'neighbors', 'are', 'still', 'breathing', ',', 'as', 'and', 'when', 'the', 'diligent', 'authorities', 'are', 'marshaling', 'their', 'cronies', 'and', 'thugs', ',', 'after', 'our', 'own', 'trials', 'of', 'loss', ',', 'while', 'the', 'mortars', 'still', 'fall', ',', 'in', 'quiet', 'moments', 'after', 'shock', ',', 'most', 'particularly', 'after', 'curfew', ',', 'at', 'sunset', ',', 'to', 'escape', ',', 'to', 'avoid', 'being', 'found', ',', 'to', 'seem', 'to', 'be', 'lost', 'right', 'here', 'in', 'this', 'place', 'where', 'you', 'or', 'I', 'have', 'always', 'wanted', 'to', 'be', 'and', 'where', 'we', 'might', 'sometimes', 'now', 'or', 'then', 'have', 'discovered', 'some', 'singular', 'hidden', 'beauty', ',', 'or', 'one', 'another', ',', 'or', 'stumbled', 'and', 'injured', 'ourselves', 'beyond', 'the', 'hearing', 'and', 'call', 'of', 'other', 'voices', ',', 'or', 'met', 'with', 'other', 'danger', ',', 'venal', 'or', 'military', ',', 'the', 'one', 'tearing', 'and', 'rending', 'and', 'opening', 'up', 'the', 'darkness', 'within', 'us', 'to', 'bleed', ',', 'yet', 'we', 'suppress', 'any', 'sound', 'that', 'might', 'have', 'expressed', 'the', 'terror', 'and', 'longing', 'and', 'horror', 'and', 'pain', 'so', 'that', 'I', 'or', 'you', 'may', 'continue', 'on', 'this', 'expedition', ',', 'this', 'before', 'or', 'after', 'assault', ',', 'and', 'still', 'return', ';', 'or', 'the', 'other', ',', 'the', 'quiet', 'evacuation', 'of', 'the', 'light', ',', 'the', 'way', ',', 'as', 'we', 'have', 'kept', 'on', 'struggling', ',', 'it', 'falls', 'on', 'us', 'and', 'removes', 'us', 'from', 'existence', 'since', 'in', 'any', 'case', 'we', 'are', 'all', 'but', 'never', 'there', ',', 'always', 'merely', 'passing', 'through', 'and', 'by', 'and', 'over', 'the', 'dust', ',', 'within', 'the', 'shadows', 'of', 'our', 'ruins', ',', 'beneath', 'the', 'wall', ',', 'within', 'the', 'razor', 'of', 'its', 'coiled', 'wire', ',', 'annihilated', ',', 'gone', ',', 'quite', 'gone', ',', 'now', 'simply', 'gone', 'and', ',', 'in', 'being', 'or', 'advancing', 'in', 'these', 'ways', ',', 'giving', 'up', 'all', 'living', 'light', 'for', 'unsettled', ',', 'heart', 'felt', 'fire', 'in', 'our', 'veins', ',', 'exiled'],
  pos: ['in', 'dt', 'nn', 'dt', 'jj', 'vbz', 'vbn', ',', 'in', 'dt', 'jj', 'in', 'dt', 'jj', 'jj', 'nn', 'vbz', 'to', 'nn', ',', 'rb', 'rb', 'nns', 'in', 'in', 'dt', 'nn', 'cc', 'nn', 'in', 'dt', 'nns', 'in', 'dt', 'rb', 'vbg', 'nn', 'vbz', ',', 'prp', 'cc', 'prp', 'md', 'vbp', 'vbn', 'in', 'in', 'jj', 'in', 'rb', 'jjr', 'nns', 'in', 'dt', 'nn', 'cc', 'in', 'dt', 'nns', ',', 'in', 'cc', 'in', 'dt', 'cc', 'in', 'nn', ',', 'rb', 'jj', ',', 'nn', 'in', 'rb', 'jj', 'jj', 'nns', ',', 'in', 'in', 'dt', 'nns', 'md', 'vb', 'nns', 'in', 'nn', 'in', 'rb', 'prp$', 'nns', ',', 'vbn', 'in', 'nns', ',', 'vbp', 'rb', 'jjr', 'vb', 'nns', 'in', 'jj', 'rb', 'jj', ':', 'rb', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nn', 'nn', ',', 'in', 'nn', 'in', 'nn', ',', 'wrb', 'dt', 'nn', 'vbp', 'rb', 'vbg', ',', 'in', 'cc', 'wrb', 'dt', 'jj', 'nns', 'vbp', 'vbg', 'prp$', 'nns', 'cc', 'vbz', ',', 'in', 'prp$', 'jj', 'nns', 'in', 'nn', ',', 'in', 'dt', 'nns', 'rb', 'vb', ',', 'in', 'jj', 'nns', 'in', 'nn', ',', 'rbs', 'rb', 'in', 'nn', ',', 'in', 'nn', ',', 'to', 'vb', ',', 'to', 'vb', 'vbg', 'vbd', ',', 'to', 'vb', 'to', 'vb', 'vbd', 'jj', 'rb', 'in', 'dt', 'nn', 'wrb', 'prp', 'cc', 'prp', 'vbp', 'rb', 'vbd', 'to', 'vb', 'cc', 'wrb', 'prp', 'md', 'rb', 'rb', 'cc', 'rb', 'vbp', 'vbn', 'dt', 'jj', 'vbn', 'nn', ',', 'cc', 'cd', 'dt', ',', 'cc', 'vbd', 'cc', 'vbn', 'prp', 'in', 'dt', 'vbg', 'cc', 'vb', 'in', 'jj', 'nns', ',', 'cc', 'vbd', 'in', 'jj', 'nn', ',', 'jj', 'cc', 'jj', ',', 'dt', 'cd', 'vbg', 'cc', 'nn', 'cc', 'vbg', 'in', 'dt', 'nn', 'in', 'prp', 'to', 'vb', ',', 'rb', 'prp', 'vbp', 'dt', 'jj', 'in', 'md', 'vbp', 'vbn', 'dt', 'nn', 'cc', 'nn', 'cc', 'nn', 'cc', 'nn', 'rb', 'in', 'prp', 'cc', 'prp', 'md', 'vb', 'in', 'dt', 'nn', ',', 'dt', 'in', 'cc', 'in', 'vb', ',', 'cc', 'rb', 'jj', ';', 'cc', 'dt', 'jj', ',', 'dt', 'jj', 'nn', 'in', 'dt', 'jj', ',', 'dt', 'nn', ',', 'in', 'prp', 'vbp', 'vbd', 'in', 'vbg', ',', 'prp', 'vbz', 'in', 'prp', 'cc', 'vbz', 'prp', 'in', 'nn', 'in', 'in', 'dt', 'nn', 'prp', 'vbp', 'dt', 'cc', 'rb', 'rb', ',', 'rb', 'rb', 'vbg', 'in', 'cc', 'in', 'cc', 'in', 'dt', 'nn', ',', 'in', 'dt', 'nns', 'in', 'dt', 'nns', ',', 'in', 'dt', 'nn', ',', 'in', 'dt', 'jj', 'in', 'prp$', 'nn', 'vbz', ',', 'vbd', ',', 'vbn', ',', 'rb', 'vbn', ',', 'rb', 'rb', 'vbn', 'cc', ',', 'in', 'vbg', 'cc', 'vbg', 'in', 'dt', 'nns', ',', 'vbg', 'in', 'dt', 'vbg', 'jj', 'in', 'vbd', ',', 'nn', 'vbn', 'nn', 'in', 'prp$', 'nn', ',', 'vbd']
};

const rural = new Rambler(sources.rural, { pos: sources.pos, name: 'Rural' });
const urban = new Rambler(sources.urban, { pos: sources.pos, name: 'Urban' });

const state = {
  element: 0,
  outgoing: true,
  current: rural,
  shadow: urban,
  updateDelay: 100,
  updating: true,
  maxSteps: 50,
  maxLegs: 10
};


/////////////////////////// MAIN ///////////////////////////////

const ele = initialize("#display");
const reader = new Reader(ele);
reader.start();
loop();

/////////////////////////// FUNCS //////////////////////////////

function loop() {
  
  if (state.updating) {
    const { outgoing, current, shadow, updateDelay } = state;

    const currentUpdate = current.step(outgoing);
    const shadowUpdate = shadow.step(outgoing);

    updateState(outgoing ? currentUpdate : shadowUpdate);
    setTimeout(loop, updateDelay);
  }
}

function updateState(update) {

  const { idx, word, next, pos } = update;
  const { outgoing, current, maxSteps } = state;
  const steps = current.numModifications();

  console.log(`${steps}${outgoing ? ')' : ']'} @${idx} ${word}`
    + ` -> ${next} [${pos}] ${current.affinity()}`);

  updateDOM(next, idx);

  // TODO: logic for legs and domain swap
  if (steps >= maxSteps) {
    state.outgoing = false;
  }
  if (steps === 0) {
    state.updating = false;
  }
}

function updateDOM(next, idx) {

  // update the one span that has changed
  const ele = document.querySelector(`#w${idx}`);
  ele.textContent = next;
  ele.style.backgroundColor = (state.outgoing ? '#fbb' : '#bbf');
}

function initialize(selector) {
  RiTa.SILENCE_LTS = true;
  state.element = document.querySelector(selector);
  validateState() && spanify(state.current.words);
  return state.element;
}

function validateState() {
  const { current, shadow, element: display } = state;
  let invalid = false; // check basic assumptions
  if (display === null) invalid = true;
  if (current.words.length !== shadow.words.length) invalid = true;
  if (current.words.length !== current.pos.length) invalid = true;
  if (shadow.words.length !== shadow.pos.length) invalid = true;
  if (current.repIds.length !== shadow.repIds.length) invalid = true;
  if (invalid) throw Error('Bad source data');
  return true;
}

function spanify(data) {
  const spans = data.reduce((html, word, i) => html
    + (`<span id='w${i}' class='text'>${word}</span>`
      + (RiTa.isPunct(data[i + 1]) ? '' : ' ')), '');
  state.element.innerHTML = spans;
}