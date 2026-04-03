let memoryStore = [];

export function saveMemory(entry) {
  memoryStore.push({
    input: entry.input,
    output: entry.output,
    timestamp: new Date()
  });
}

export function getMemory() {
  return memoryStore.slice(-5);
}
