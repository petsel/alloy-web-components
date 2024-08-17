import { execute as executeSafely } from '../../../utility/try-catch';
import { event as trustedEvent } from '../../compound/base/trusted';


const { CustomEvent, isTrustedOwn: isTrustedOwnEvent } = trustedEvent;


// intersect[root="closest(#scrollArea[data-foo="bar"])"]
// intersect[root="closest(#scrollArea[data-foo="bar"])"][rootMargin="0px"][threshold="1"][threshold="1"]
// intersect[rootMargin="0px"][root="closest(#scrollArea[data-foo="bar"])"][threshold="1"]
// intersect[rootMargin="0px"][root="closest(#scrollArea[data-foo="bar"])"]
// intersect[root="closest(#scrollArea[data-foo=])"]
// intersect[rootMargin="0px"]
// intersect
//
//
// ^intersect\b
//
// ^intersect(?:\[.*?\](?=\[|$)){1,3}
//
// \[.*?\](?=\[|$)

function parseIntersectionObserverOptions() {

}



function parseEventConfigrations(value) {
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


function parseTriggerPointFromEventConfig(config) {
  const regXIsIntersection = /^intersecting\b/;
  const regXIsFirstAppearance = /^first-appearance\b/;

  return (
    config.test(regXIsFirstAppearance) &&
    parseFirstAppearanceTriggerPoint(config)
  ) || (
    config.test(regXIsIntersection) &&
    parseIntersectionTriggerPoint(config)
  ) || (
    parseDomEventTriggerPoint(config)
  );
}


function parseTriggerPoints(value) {
  const [eventConfigList, eventDiffValue] = parseEventConfigrations(value);
  // const [otherConfigList, otherDiffValue] = parseOtherConfigrations(eventDiffValue);

  return eventConfigList
    .map(parseTriggerPointFromEventConfig);
    // .concat(
    //   otherConfigList
    //     .map(parseTriggerPointFromOtherConfig)
    // );
}



/**
 * @this {Microstructure}
 * @param {CompoundData} compoundData
 */
export function withTriggers(compoundData) {
  const compound = this;

  console.log('`withTriggers`');

  if (compound.hasAttribute('triggers')) {

  } else {
    console.warn(
      new RangeError(
        "The Alloy Compound, though having applied the `triggers` trait, misses the 'triggers'-attribute.\n",
      ),
    );
  }
}
