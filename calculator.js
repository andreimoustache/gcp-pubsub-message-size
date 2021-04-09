function calculate(messsage, attributes) {
  const messageSize = JSON.stringify(message).length;
  const attributesSize = JSON.stringify(attributes).length - 2;

  const timestampSize = 20;

  return messageSize + attributesSize + timestampSize;
}

function parseJsonOrDefault(o) {
  if (!o) return {};

  let parsed = {};
  try {
    parsed = JSON.parse(o);
  } catch (error) {
    console.error("Encountered an error while parsing JSON.");
  }

  return parsed;
}

function getSerialisedSize(o) {
  const message = parseJsonOrDefault(o);
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(JSON.stringify(message));
  return encodedMessage.length;
}

document.addEventListener("DOMContentLoaded", function (_) {
  new Ractive({
    target: "#target",
    template: "#template",
    data: {
      message: '{ "some_property": true }',
      attributes: null,
      rate: 100,
      ratePeriod: 1
    },
    computed: {
      messageSize () {
        const message = this.get('message');
        return !!message ? getSerialisedSize(message) : 0;
      },
      attributesSize () {
        const attributes = this.get('attributes');
        return !!attributes ? getSerialisedSize(attributes) - 2 : 0
      },
      payloadSize () {
        return this.get('messageSize') + this.get('attributesSize') + 20;
      },
      volume () {
        return this.get('payloadSize') * this.get('rate') * parseInt(this.get('ratePeriod'));
      }
    }
  });
});
