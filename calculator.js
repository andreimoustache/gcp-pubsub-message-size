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

function bindRactive(ractive) {
  ractive.observe("message", function (newValue, oldValue) {
    let messageSize = 0;
    if (!!newValue) messageSize = getSerialisedSize(newValue);
    ractive.set("messageSize", messageSize);
  });

  ractive.observe("attributes", function (newValue, oldValue) {
    let attributesSize = 0;
    if (!!newValue) attributesSize = getSerialisedSize(newValue);
    ractive.set("attributesSize", attributesSize);
  });

  ractive.observe("attributesSize messageSize", function () {
    ractive.set(
      "payloadSize",
      ractive.get("messageSize") + ractive.get("attributesSize") + 20
    );
  });

  ractive.observe("payloadSize rate", function () {
    ractive.set("volume", ractive.get("payloadSize") * ractive.get("rate"));
  });x  
}

document.addEventListener("DOMContentLoaded", function (_) {
  const ractive = new Ractive({
    target: "#target",
    template: "#template",
    data: {
      rate: 100,
    },
  });

  bindRactive(ractive);
});
