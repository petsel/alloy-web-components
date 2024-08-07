// const trustedCompoundEventId = Symbol('trusted-compound-event');

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

function isTrustedCompoundEvent(evt) {
  return !!evt && (
    (evt instanceof TrustedCompoundCustomEvent) ||
    (evt instanceof TrustedCompoundEvent)
  );
}
function isValidCompoundLifeCycleEvent(evt) {
  return (
    isTrustedCompoundEvent(evt) &&
    (evt.target === evt.currentTarget)
  );
}

export const trusted = {
  Event: TrustedCompoundEvent,
  CustomEvent: TrustedCompoundCustomEvent,
  isTrusted: isTrustedCompoundEvent,
  isValidLifeCycle: isValidCompoundLifeCycleEvent,
};
