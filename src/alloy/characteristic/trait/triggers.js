import { isFunction } from '../../../utility/type-detection';
import { execute as executeSafely } from '../../../utility/try-catch';
import { event as trustedEvent } from '../../compound/base/trusted';


const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


function spliceFirstBalancedParenthesesContent(value) {
  const [leftContent, ...rest] = value.split('(');

  // no match guard.
  if (!rest) {
    return [value];
  }
  value = rest.join('(');

  const regXMilling = /.*?(?<!\\)(\(|\))/g;
  const openingChar = '(';
  const closingChar = ')';
  const countLookup = new Map([ [openingChar, 1], [closingChar, -1] ]);

  let balanceCount = 1;
  let result, char;
 
  while (balanceCount && (result = regXMilling.exec(value))) {
    char = result.at(1);
    balanceCount = balanceCount + countLookup.get(char);
  }
  return [
    leftContent,
    value.slice(0, (regXMilling.lastIndex - 1)),
    value.slice(regXMilling.lastIndex),
  ];
}

function parseElementQueryFromSelectorValue(selectorValue) {
  let elementQuery;

  const regXClosest = /^closest\(/;
  if (regXClosest.test(selectorValue)) {

    const [left, closestSelector, right] =
      spliceFirstBalancedParenthesesContent(selectorValue);

    elementQuery = (function queryClosest(selector, elementNode) {
      return elementNode.closest(selector);
    }).bind(null, closestSelector);

  } else {

    elementQuery = (function queryDocument(selector, elementNode) {
      return document.querySelector(selector);
    }).bind(null, selectorValue);
  }
  return elementQuery;
}


function aggregateIntersectionOptions(options, [key, value]/*, idx, arr*/) {
  options[key] = (key === 'root')

    ? parseElementQueryFromSelectorValue(value)
    : value;

  return options; 
}


function dispatchIntersection(intersectionEntry) {
  intersectionEntry.target.dispatchEvent(
    new CustomEvent('ca-intersection', {
      detail: {
        intersection: intersectionEntry,
      },
    }),
  );
}
function handleIntersection(listOfIntersectionEntries) {
  console.log({ listOfIntersectionEntries });

  listOfIntersectionEntries.forEach(dispatchIntersection)
}

function disconnectObserverAndAbort(observer, controller, evt) {
  debugger;
  if (isTrustedOwnEvent(evt)) {

    observer.disconnect();
    controller.abort();
  }
}

function registerIntersectionObserver(compound, observerOptions) {
  const controller = new AbortController;
  const { signal } = controller;

  const observer = new IntersectionObserver(handleIntersection, observerOptions);
  const disconnect = disconnectObserverAndAbort.bind(null, observer, controller);

  compound.addEventListener('ca-adopted', disconnect, { signal });
  compound.addEventListener('ca-disconnected', disconnect, { signal });

  observer.observe(compound);
}

// (#scrollArea\)[data-foo="bar"]:not([foobar]):is()):not([foo]:is(bar))
// 
// intersection[root=closest(#scrollArea[data-foo="bar"])][root="closest(#scrollArea[data-foo="bar"])"][root="closest(#scrollArea[data-foo="bar"])"]
// intersection[root='closest(#scrollArea[data-foo="bar"])']
// intersection[root="closest(#scrollArea[data-foo="bar"])"][rootMargin="0px"][threshold="1"][threshold="1"]
// intersection[rootMargin="0px"][root="closest(#scrollArea[data-foo="bar"])"][threshold="1"]
// intersection[rootMargin="0px"][root="closest(#scrollArea[data-foo="bar"])"]
// intersection[root="closest(#scrollArea[data-foo=])"]
// intersection[rootMargin="0px"]
// intersection
// 
// 
// 
// ^intersection\b
// 
// ^intersection(?:\[.*?\](?=\[|$)){1,3}
// 
// 
// \[.*?\](?=\[|$)
// 
// /\[(?<key>root|rootMargin|threshold)=(?:(?<unquotedValue>[^"'].*?[^"'])\](?=\[|$)|(?<quote>["'])(?<quotedValue>.*?)\k<quote>\](?=\[|$))/img
// 
// [root="closest(#scrollArea[data-foo=bar\=][data-foo="bar\="])"] => ="[^"]+?([^=]|\\=)"
// 
// 
// .*?(?<!\\)(?<match>\(|\))
//
function applyIntersectionTriggerPoint(compound, compoundData, optionsConfig, filterConfig) {
  const keyLookup = new Map([
    ['root', 'root'],
    ['rootmargin', 'rootMargin'],
    ['threshold', 'threshold'],
  ]);
  const regXOptions =
    /\[(?<key>root|rootMargin|threshold)=(?:(?<unquotedValue>[^"'].*?[^"'])\](?=\[|$)|(?<quote>["'])(?<quotedValue>.*?)\k<quote>\](?=\[|$))/img;

  const options = [...optionsConfig.matchAll(regXOptions)]
    .map(({ groups: { key, quotedValue, unquotedValue } }) =>
      [keyLookup.get(key.toLowerCase()), (quotedValue || unquotedValue)]
    )
    .reduce(aggregateIntersectionOptions, {});

  // debugger;

  options.root = isFunction(options.root) && options.root(compound) || null;

  registerIntersectionObserver(compound, options);  
}

function applyFirstAppearanceTriggerPoint(compound, compoundData, eventConfig, filterConfig) {
  debugger;
}

function applyDomEventTriggerPoint(compound, compoundData, eventConfig, filterConfig) {
  debugger;
}


function applyEventBasedTriggerPoint({ event: eventConfig, filter: filterConfig }) {
  const { compound, compoundData } = this;

  const regXIsFirstAppearance = /^first-appearance\b/;
  const regXIntersectionOptions = /^intersection(?<options>(?:\[.*?\](?=\[|$)){1,3})/i

  if (regXIsFirstAppearance.test(eventConfig)) {
    // debugger;

    applyFirstAppearanceTriggerPoint(compound, compoundData, eventConfig, filterConfig);

  } else if (regXIntersectionOptions.test(eventConfig)) {
    // debugger;

    applyIntersectionTriggerPoint(
      compound,
      compoundData,
      regXIntersectionOptions.exec(eventConfig).groups.options,
      filterConfig,
    );
  } else {
    // debugger;

    applyDomEventTriggerPoint(compound, compoundData, eventConfig, filterConfig);
  }
}


function parseEventConfigrationsAndRest(value) {
  // - parsing of one or more trigger event/s plus each
  //    its optional css-selector based filter/matcher ...
  //
  //    /:event\((?<event>.*?)\)(?:(?<filter>\:(?!event)\w+\(.*?\)(?=\s+|$))|\s+|$)/g
  //    :event(intersect[root="closest(#scrollArea)"][rootMargin="0px"][threshold="1"] once):not(:state(-ca-has-matching-path)):state(-ca-has-matching-path) :event(click) :event(ca-connected-trait:fetches):not(:state(-ca-has-matching-path)):state(-ca-has-matching-path) :event(click):state(-ca-has-matching-path) :event(click)

  const regXMatchEvent = /:event\((?<event>.*?)\)(?:(?<filter>\:(?!event)\w+\(.*?\)(?=\s+|$))|\s+|$)/;
  const regXSanitizeEvents = /\s*:event\(/g;

  value = value.replace(regXSanitizeEvents, ' :event\(').trim();

  const eventConfigList = [];

  let /** @type RegExpExecArray */ result;

  while (result = regXMatchEvent.exec(value)) {
    const match = result[0];
    const { input, index, groups: { event, filter } } = result;

    value = [
      input.slice(0, index),
      input.slice(index + match.length),
    ]
    .join('');

    eventConfigList.push({
      event,
      ...(filter && { filter } || {}),
    });
  }
  return [eventConfigList, value.trim()];
}


function applyTriggerPoints(compound, compoundData) { 
  const attrValue = compound.getAttribute('triggers');

  const [eventConfigList, eventDiffValue] = parseEventConfigrationsAndRest(attrValue);    
  // const [otherConfigList, otherDiffValue] = parseOtherConfigrationsAndRest(eventDiffValue);

  eventConfigList
    .forEach(applyEventBasedTriggerPoint, { compound, compoundData });/*

  otherConfigList
    .forEach(applyOtherBasedTriggerPoint, { compound, compoundData });*/
}


/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withTriggers(compoundData) {
  const compound = this;

  console.log('`withTriggers`');

  if (compound.hasAttribute('triggers')) {

    applyTriggerPoints(compound, compoundData);

  } else {
    console.warn(
      new RangeError(
        "The Alloy Compound, though having applied the `triggers` trait, misses the 'triggers'-attribute.\n",
      ),
    );
  }
}
