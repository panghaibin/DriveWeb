import {decode} from "fast-png";
import localforage from "localforage";

export async function download(url) {
  const ext = url.split('.').pop();
  const resp = await fetch(url, {referrer: ''});
  const ab = await resp.arrayBuffer();
  let data;
  if (ext === 'png') {
    let d = decode(ab).data.buffer;
    let end = unpack(d.slice(0, 4));
    data = d.slice(4, 4 + end);
  } else {
    data = ab.slice(62);
  }
  return data

  function unpack(ab) {
    return new Uint8Array(ab)
      .reverse()
      .reduce((x, y) => (x << 8) + y)
  }
}

export async function download_block(blocks, filename) {
  let chunks = [];
  for (let i = 0; i < blocks.length; i++) {
    let u = blocks[i].info.url;
    let blob = await localforage.getItem(`${filename}_${i}`);
    if (!blob) {
      let data = await download(u);
      blob = new Blob([new Uint8Array(data)]);
      chunks[i] = blob;
      await localforage.setItem(`${filename}_${i}`, blob)
    } else {
      chunks[i] = blob;
    }
  }
  return chunks;
}
