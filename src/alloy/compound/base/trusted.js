class TrustedCompoundEvent extends Event {
  constructor(...args) {
    super(...args);
  }
}
class TrustedCompoundCustomEvent extends CustomEvent {
  constructor(...args) {
    super(...args);
  }
}

function isTrustedEvent(evt) {
  return !!evt && (
    (evt instanceof TrustedCompoundCustomEvent) ||
    (evt instanceof TrustedCompoundEvent)
  );
}
function isTrustedOwnEvent(evt) {
  return (
    isTrustedEvent(evt) &&
    (evt.target === evt.currentTarget)
  );
}

export const /** @type TrustedEventOptions */ event = {
  Event: TrustedCompoundEvent,
  CustomEvent: TrustedCompoundCustomEvent,
  isTrusted: isTrustedEvent,
  isTrustedOwn: isTrustedOwnEvent,
};
